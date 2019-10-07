import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import SASIcon from '../Icons/SASIcon';

//const logo = require('../images/sas_logo.svg');

const styles = theme => ({
  appBar: {
    position: 'relative',
    boxShadow: 'none',
    borderBottom: `0.5px solid ${theme.palette.grey['100']}`,
  },
  inline: {
    display: 'inline',

  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
  },

  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  productLogo: {
    display: 'inline-block',
    borderLeft: `1px solid ${theme.palette.grey['A100']}`,
    marginLeft: 10,
    marginBottom: 6,
    paddingLeft: 24
  },
  tagline: {
    display: 'inline-block',
    marginLeft: 3
  },
  iconContainer: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  iconButton: {
    float: 'right'
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: 'auto'
  }
})

class Topbar extends Component {

  state = {
    value: 0,
  };


  componentDidMount() {
    window.scrollTo(0, 0);
  }


  render() {

    const { classes } = this.props;

    return (
      <AppBar className={classes.appBar}>
        <Toolbar style={{minHeight:45}}>
            <Grid container spacing={24} alignItems="baseline">
              <Grid item xs={12}  className={classes.flex}>
                  <div className={classes.inline}>
                    <Typography variant="h6" color="inherit" noWrap>
                      <Link to='/' className={classes.link}>
                        <SASIcon/>
                      </Link>
                    </Typography>
                  </div>
                  <div className={classes.productLogo}>
                    <Typography variant="h6" color="inherit" align="right" noWrap>
                      Image Classification
                    </Typography>
                  </div>
              </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(withStyles(styles)(Topbar))
