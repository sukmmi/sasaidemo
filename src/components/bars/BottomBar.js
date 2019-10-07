import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SvgIcon from '@material-ui/core/SvgIcon';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';


const barSteps = [
  {
    label: 'Capture',
    path:
      '/',
  },
  {
    label: 'Analyze',
    imgPath:
      '/analyze',
  },
  {
    label: 'Insight',
    imgPath:
      '/insight',
  },
];

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 500
  },
  stickToBottom: {
    width: "100%",
    bottom: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  hide: {
  display: 'none'
  }
});



const CustomWebCamIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M10 20H5v2h5v2l3-3-3-3v2zm4 0v2h5v-2h-5zM12 8c1.1 0 2-.9 2-2s-.9-2-2-2-1.99.9-1.99 2S10.9 8 12 8zm5-8H7C5.9 0 5 .9 5 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM7 2h10v10.5c0-1.67-3.33-2.5-5-2.5s-5 .83-5 2.5V2z"/>
  </SvgIcon>
);


class BottomBar extends React.Component {
  state = {
    activeTabValue: 0,
    activeTabLabel: "Capture",
    enableInsight:false,
    activeStep: 0
  };

  constructor(props) {
    super(props);
    //console.log(props);
  }


  handleBottomBarChange = (event, activeTabValue) => {
    //console.log(debug_component+'handleBottomBarChange'+'value > ',activeTabValue);
    let newActiveStepValue;
    let newActiveTabValue;
    if(activeTabValue === 0){
      //console.log(debug_component+'handleBottomBarChange'+'tab to > ',"Analyze");
      newActiveTabValue=1;
      newActiveStepValue=1;
      this.setState({ activeTabValue: 1,activeStep:1 });
    }else if(activeTabValue === 1) {
      //console.log(debug_component+'handleBottomBarChange'+'tab to > ',"Insight");
      newActiveTabValue=((this.state.activeTabValue === 2) ? 1:2);
      newActiveStepValue=newActiveTabValue;
      this.setState({ activeTabValue: newActiveTabValue,activeStep:newActiveStepValue});
    }
    else {
      //console.log(debug_component+'handleBottomBarChange'+'tab to > ',"Insight");
      this.setState({ activeTabValue:2,activeStep:2});
    }



    this.props.onChange(event,newActiveTabValue,newActiveStepValue);
  };



  handleNext = () => {
    //console.log(debug_component+'.handleNext called');
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
      activeTabValue:prevState.activeTabValue + 1,
    }));
    this.props.handleNext(this.state);
  };

  handleBack = () => {
    //console.log(debug_component+'.handleBack called');
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
      activeTabValue:prevState.activeTabValue - 1,
    }));
    this.props.handleBack(this.state);
  };


  currentTab = () => {
    //this is called when tabs value state changes -- value={this.current() || this.state.value}
    if(this.props.location.pathname === '/') {
      return 0
    }
    if(this.props.location.pathname === '/insight') {
      return 1
    }
  }



  render() {
    //console.log(debug_component+'render() called');
    const { classes, theme,disableTab } = this.props;
    const { activeTabValue,activeStep } = this.state;
    const maxSteps = barSteps.length;
    //const tabs = this.grids.map((grid) => <Tab key={grid.gridIndex} />);
    console.log('BottomBar render() this.props.isLoading -> ',this.props.disableTab);
    return (
      <Paper square className={classes.stickToBottom}>
        <Tabs
          value={this.currentTab() || this.state.activeTabValue}
          onChange={this.handleBottomBarChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Capture" disabled={(disableTab === 0)}  className={activeTabValue === 1 || activeTabValue === 2 ? classes.hide:null} icon={<CustomWebCamIcon />} key={0} component={Link} to={{pathname: '/',search: this.props.location.search}} />
          <Tab label="Analyze" disabled={(disableTab === 1)} className={activeTabValue === 0  ? classes.hide:null} icon={<CustomWebCamIcon />} key={1} component={Link} to={{pathname: '/',search: this.props.location.search}} />
          <Tab label={"Insight"} disabled={true} icon={<PersonPinIcon />} key={2} component={Link} to={{pathname: '/insight',search: this.props.location.search}}/>
        </Tabs>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          className={classes.mobileStepper}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={activeStep === 0 || activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </Paper>

    );
  }
}

BottomBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(BottomBar));
