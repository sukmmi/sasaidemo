import React,  { Component,createContext } from 'react';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import InsightTable from './tables/InsightTable';

const XMLParser = require('react-xml-parser');

const styles = theme => ({

})

const initialState = {
  data: null,
  loading: false,
  error: null
};

const initialQueryContextValue = {
  state: initialState,
  actions: {}
};

const SASESPContext = createContext(
  initialQueryContextValue
);


class SASESPProvider extends React.Component {


  constructor(props) {
    super(props);
    this.protocol='https';
    this.host='ai.sasanzdemo.com';
    this.port='5558';
    this.baseURL=this.protocol+'://'+this.host+':'+this.port+'/SASESP';
    this.publishEndpoint='/windows/ImageClassification_Snacks/cq1/w_imageData';
    this.inferenceEndpoint='/events/ImageClassification_Snacks/cq1/inferenceEndpoint';
  }


    static defaultProps = {
      score:'',
      model: '',
      image: '',
      id:'',
    };

    state ={
      data:[],
      loading:false,
      error:null
    };



    urlWithParams = (urlString, params={}) => {
      var url = new URL(urlString);
      var searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        searchParams.append(key, params[key]);
      });
      url.search = searchParams.toString();
      return url.toString();
    }


    async sendImageToESP() {
      try {
        const {
          image,
          id
        } = this.props;

        let image_replaced=null;
        if (image !== null){
          console.log('Main.setImageRef this.img --> ',this.img);
          image_replaced=image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        }

        let req_data=[{id:id,_image_:image_replaced}];
        let fetchOptions={method:"PUT",
                          headers: {'Content-Type':'application/json'},
                          body: JSON.stringify(req_data)
                        };
        let esp_send_url=this.baseURL+this.publishEndpoint+'/state?value=injected';
        //console.log('ImageClassifier.SASESPProvider.sendImageToESP() sending to ESP Image Id --> ', id);
        let sendImageResponse = await fetch(esp_send_url, fetchOptions);
        let status = await sendImageResponse.text();
        //console.log('ImageClassifier.SASESPProvider.sendImageToESP() sent to ESP Image Id --> ', id);
        return sendImageResponse;
      } catch(err) {
        // catches errors both in fetch and response.json
        return err;
      }
    }

    async  test() {
    for (let i = 0; i < 2; i++) {
        console.log('Before await for ', i);
        let result = await Promise.resolve(i);
        console.log('After await. Value is ', result);
    }
  }

    async getScoreFromESP() {
      try {
        const {
          id
        } = this.props;

        let fetchOptions={method:"GET"};
        let esp_events_url=this.urlWithParams(this.baseURL+this.inferenceEndpoint+'?',{"id":id});
        let eventsFetchResponse = null;
        let eventsResponseText = null;
        let xml = null;
        let eventsData=null;
        //wait 2 seconds to give some time for ESP to score
        await new Promise(resolve => setTimeout(resolve, 1000));
        let attempt=0;
        // 3 attempts
        for (let i = 0; i < 60; i++) {
          //console.log('ImageClassifier.SASESPProvider.getScoreFromESP() Attempt --> ', i);
          eventsFetchResponse = await fetch(esp_events_url, fetchOptions);
          //console.log('ImageClassifier.SASESPProvider.getScoreFromESP() requesting score Image Id --> ', id);
          eventsResponseText = await eventsFetchResponse.text();
          console.log('ImageClassifier.SASESPProvider.getScoreFromESP() Response received --> ', eventsResponseText);

          let xml = new XMLParser().parseFromString(eventsResponseText);
          //console.log("LOOP EXIT ---> ",xml.attributes["count"]);
          if (xml.attributes["count"] > 0){
            console.log("Exit LOOP now ", attempt+1);
            break;
          }
          attempt++
        }
        // return fetch response promise
        return eventsResponseText;
        //return new Promise((resolve) => {resolve(eventsResponseText);});
      } catch(err) {
        // catches errors both in fetch and response.json
        //alert(err);
        return err;
        //return new Promise((reject) => {reject(err);});
      }

    }

    request = () => {
        var XMLParser = require('react-xml-parser');

        this.sendImageToESP()
        .then(response => this.getScoreFromESP())
        .then(function(eventsXML){
            //console.log(eventsXML)
            let xml = new XMLParser().parseFromString(eventsXML);
            console.log('ImageClassifier.SASESPProvider.request() score received count --> ', xml.attributes["count"]);
            let eventsData=xml.getElementsByTagName('event');
            var arr = [];
            Object.keys(eventsData[0].children).forEach(function(key) {
              if(eventsData[0].children[key].name !== 'id'){
                arr.push({name:eventsData[0].children[key].name,
                          value:eventsData[0].children[key].value
                        });
              }

            });
            //console.log('ImageClassifier.SASESPProvider.request() score received --> ', arr);
            return arr;
        })
        .then((eventsData) => this.setState({loading:false,data:eventsData}))
        .catch(error => this.setState({loading:false,error:error}));
    }
    componentDidMount() {
      //console.log('ImageClassifier.SASESPProvider.componentDidMount this --> ',this);
      this.setState({loading:true});
      this.request();
    }

    render(){
        const data=this.state;
        console.log("SASESPProvider render() state --> ",this.state);
        return (
            <SASESPContext.Provider value={ data } >
                { this.props.children }
            </SASESPContext.Provider>
        )
    }
}

// Add a 'Consumer' to take current 'image' state
class SASESPConsumer extends React.Component {
    render(){
        //console.log('ImageClassifier.SASESPConsumer.render called');
        return (
            <SASESPContext.Consumer>
                { data => (
                    <InsightTable data={data}/>
                )}
            </SASESPContext.Consumer>
        );
    }
};



class ImageClassifier extends Component {

  handleChange = (event,value) => {
   console.log(value);
  };
  render() {
    const { classes,src,id } = this.props;
    //console.log('ImageClassifier.render image src--> ',this.props.src);
    //console.log('ImageClassifier.render image id --> ',this.props.id);
    const currentPath = this.props.location.pathname;
    return (
      <React.Fragment>
        <SASESPProvider image={this.props.src} id={this.props.id}>
          <SASESPConsumer/>
        </SASESPProvider>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(ImageClassifier));
