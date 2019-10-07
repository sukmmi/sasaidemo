import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Webcam from 'react-webcam';
import CircularStatic from './progress/CircularStatic';
import Topbar from './bars/Topbar';
import BottomBar from './bars/BottomBar';
import ImageClassifier from './ImageClassifier';


const styles = theme => ({
  typography: {
    useNextVariants: true,
  },
  main:{
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
    justifycontent: 'center',
    backgroundSize: 'cover',
    width: 360,
    margin: 'auto',
    overflow: 'hidden'
  },
  button: {
    margin: theme.spacing.unit,
  },
  paperBottom:{
    flex: 1,
    height: '100%',
    width: 300,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    margin:'auto'
  },
  paperTop:{
    flex: 4,
    width:300,
    height:400,
    textAlign: 'center',
    justifyContent: 'center',
    margin:'auto'
  },
  container: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing.unit,
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
  stickToBottom: {
    width: "100%",
    bottom: 0
  },
});

class Main extends Component {

  state = {
    loading: false,
    bottombarvalue: 0,
    query: 'webcam',
    isCameraActive:true,
    facingMode: 'user',
    imageSrc:null,
    webcamRef:null,
    webCamwidth:300,
    nextStep:'capture',
    activeTab: 0,
    imageId:'',
    disableTab:0,
  };

  setWebCamRef = webcam => {
   this.webcam = webcam;
 };

 setImageRef = img => {
  this.img = img;
    if (this.img !== null){
      console.log('Main.setImageRef this.img --> ',this.img);
    }
  };


  componentDidMount() {
  }

  stopCam = () => {
    this.webcam.stopCapture();
  }




  capture = () => {

    //console.log('Main.handleChange --> webcam object ',this.webcam);
    if(this.webcam !== null){
       const uuidv1 = require('uuid/v1');
       this.image_key=uuidv1();
       this.imageSrc = this.webcam.getScreenshot();
       if (this.imageSrc === null){
         //disableTab
         this.setState({ imageSrc: null, imageId:'',query:'success',disableTab:1,activeTab:1});
       }else{
         this.setState({ imageSrc: this.imageSrc, imageId:this.image_key,query:'success',activeTab:1});
       }
       //this.setState({ imageSrc: this.imageSrc, imageId:this.image_key,query:'success',activeTab:1});
       /*setTimeout(() => {
               console.log('Main.capture change imageSrc state');
               this.setState({ imageSrc: this.imageSrc, imageId:this.image_key,query:'success',activeTab:1});
           }, 1000);*/
       //console.log('Main.capture this.webcam.getScreenshot() --> ',this.imageSrc);
    }
    //this.setState({ imageSrc: imageSrc, query:'success'});
  };


  handleBottomBarChange = (event,newtab,newstep) => {
   //console.log('Main.handleBottomBarChange new bar value',newtab);
   if (newtab === 1){
     if (this.webcam !== null){
       //console.log('Main.handleBottomBarChange Capture Tab selected');
       this.setState({ imageSrc: null, activeTab:1,query:'progress'});
       //console.log('Main.handleBottomBarChange Switching to Analyze');
       this.capture();
     }
     this.setState({activeTab:1,query:'success'});
   } else if (newtab === 2){
        //console.log('Main.handleBottomBarChange Switching to Insight');
        this.setState({ activeTab:2,query:'insight'});
   } else if (newtab === 0){
     //console.log('Main.handleBottomBarChange Insight Tab selected');
     this.setState({activeTab:0});
   }
  };

  handleNext = (state) => {
    //console.log('Main.handleNext called',state);
    this.setState({ activeTab:state.activeTabValue+1,});
  };

  handleBack = (state) => {
    //console.log('Main.handleBack called',state);
    this.setState({ activeTab:state.activeTabValue-1,query:'success'});
  };


  onUserMedia = () => {
    this.setState({disableTab:2});
    console.log('Main.onUserMedia called');
  };

  onUserMediaError = () => {
    this.setState({disableTab:0});
    console.log('Main.onUserMedia called');
  };

  render() {
    const { classes } = this.props;
    const { query,imageSrc,activeTab,imageId,disableTab } = this.state;
    const camera_type='back';
    var videoConstraints=null;
    //console.log('Main.render current step --> ',activeTab);
    console.log('Main.render query',query);
    if(camera_type === 'front'){
      videoConstraints = {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 1080 },
        facingMode: "user"
      };
    } else{
      videoConstraints = {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 1080 },
        facingMode: { exact: "environment" }
      };
    }




    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div>
        <div className={classes.main}>
          <Paper className={classes.paperTop} style={{margin:'auto'}}>
            { (activeTab === 0) ? (
                  <Fade in={true}>
                  <Webcam
                    audio={false}
                    ref={this.setWebCamRef}
                    onUserMedia={this.onUserMedia}
                    onUserMediaError={this.onUserMediaError}
                    screenshotFormat="image/jpeg"
                    style={{
                            width:'100%',
                            height:'auto'
                          }}
                    videoConstraints={videoConstraints}
                  />
                  </Fade>):null
            }

            {(activeTab === 1 && query === 'success') ?
              (<img ref={this.setImageRef} alt="Failed to capture" src={imageSrc} style={{width:'100%'}}/>) :null
            }

            {(query === 'progress') && <CircularStatic/>}

            {(activeTab === 2) ?
              (<ImageClassifier src={imageSrc} id={imageId} style={{width:'100%'}}/>) :
              null
            }


          </Paper>
          <Paper className={classes.paperBottom} style={{margin:'auto',textAlign: 'center'}}>
            <BottomBar disableTab={disableTab}
                       onChange={this.handleBottomBarChange}
                       handleNext={this.handleNext}
                       handleBack={this.handleBack}/>
          </Paper>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Main));
