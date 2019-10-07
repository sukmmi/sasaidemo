import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'bootstrap/dist/css/bootstrap.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import '../css/BallNewtonCradle.css';
import teal from '@material-ui/core/colors/teal';
import grey from '@material-ui/core/colors/grey';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';

/*const insighttheme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    background: {
              paper: grey[700],
          }
  },
});*/

const insighttheme = createMuiTheme({
  typography: { useNextVariants: true },
});
const styles = theme => ({

  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin:'auto'
  },
  textalign: {
    textAlign: 'left !important'
  },
  table: {
    width: '100%',
    margin:'auto'
  },
  paperTable:{
    textAlign: 'center',
    justifyContent: 'center',
    width: '98%',
    marginTop: theme.spacing.unit * 2,
    marginLeft:'2%',
    overflowX: 'auto',
    padding:10,
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
});


let id = 0;
function createData(name, value) {
  id += 1;
  return { id, name, value };
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function LinkTab(props) {
  return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}


class InferenceTable extends React.Component {
  state = {
    loading: false,
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, data } = this.props;
    const { value } = this.state;
    const rows=data["data"];


    //console.log("InferenceTable render() isLoading",(rows !== null));

    let descriptions=[];
    let url='';
    let calculations=[];
    let objectName='';

    rows.map(row => {
      if (!isNaN(parseFloat(row.value))){
        //numeric value
        calculations.push({name:row.name,
                  value:row.value
                });
      }
      else if(row.name === 'URL'){
        url=row.value;
      }
      else {
        if(row.name === 'I__label_'){
          objectName=row.value;
        }

        descriptions.push({name:row.name,
                  value:row.value
                });
      }
    });

    const Suggestion_removed = () => (
      <Paper className={classes.paperTable}>
        <Table striped="true" bordered="true" size="sm">
          <tbody>
          <tr>
            <td className={classes.textalign} style={{width:'100%'}}>The suggested url is: </td>
          </tr>
          </tbody>
        </Table>
      </Paper>
    );

    const Suggestion = () => (
        <Paper className={classes.paperTable}>
          <Typography variant="body2" align="left" style={{ whiteSpace: "normal",
                      wordWrap: "break-word"}}>
            The object is {objectName} and suggested url is {url} .
           </Typography>
         </Paper>
    );

    const Url = () => (
      <Paper className={classes.paperTable}>
        <Table striped="true" bordered="true" size="sm" >
          <tbody>
          <tr>
            <td className={classes.textalign} style={{width:'100%'}}>
              <Link href={url} color="inherit" className={classes.link} target="_blank">
                <Typography align="wrap" gutterBottom>
                  {url}
                 </Typography>
              </Link>
            </td>
          </tr>
          </tbody>
        </Table>
      </Paper>
    );

    const Error = () => (
      <Paper className={classes.paperTable} justify = "center" style={{marginTop:"45%"}}>
          <Typography variant="body2" align="left" style={{ whiteSpace: "normal",wordWrap: "break-word"}}>
            Something went wrong..
          </Typography>
          <Typography variant="body2" align="left" style={{ whiteSpace: "normal",wordWrap: "break-word"}}>
            Cannot connect to server.
          </Typography>
      </Paper>
    );


    const ErrorPage = () => (
      <NoSsr>
          <AppBar position="static">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab disabled={true} label="Summary" href="page1" />
              <LinkTab disabled={true} label="Detail" href="page2" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><Error/></TabContainer>}
          {value === 1 && <TabContainer><Error/></TabContainer>}
      </NoSsr>
    );


    const Score = () => (
      <Paper className={classes.paperTable}>
        <Table striped="true" bordered="true" size="sm">
          <tbody>
             {descriptions.map(row => (
                <tr key={row.name}>
                  <td className={classes.textalign} style={{width:'45%'}}>{row.name}</td>
                  <td className={classes.textalign} style={{width:'55%'}}><div><div className="progress" style={{height: 20}}>
                    {row.value}
                  </div></div>
                  </td>
                </tr>
            ))}
            {calculations.map(row => (
               <tr key={row.name}>
                 <td className={classes.textalign} style={{width:'45%'}}>{row.name}</td>
                 <td className={classes.textalign} style={{width:'55%'}}><div><div className="progress" style={{height: 20}}>
                       <div className="progress-bar" role="progressbar" style={{width: row.value*100+'%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                         {Math.floor(row.value*100)+'%'}
                       </div>
                 </div></div>
                 </td>
               </tr>
           ))}
          </tbody>
        </Table>
      </Paper>
    );

    const Newpage= () => (
      <NoSsr>
          <AppBar position="static">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab label="Summary" href="page1" />
              <LinkTab label="Detail" href="page2" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><Suggestion/></TabContainer>}
          {value === 1 && <TabContainer><Score/></TabContainer>}
      </NoSsr>
    )

    const progress = () => (
      <NoSsr>
          <AppBar position="static">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab disabled={true} label="Summary" href="page1" />
              <LinkTab disabled={true} label="Detail" href="page2" />
            </Tabs>
          </AppBar>
          {value === 0 &&
            <TabContainer>
              <Grid container justify = "center" style={{marginTop:"50%"}}>
                <CircularProgress className={classes.progress}/>
              </Grid>
            </TabContainer>}
          {value === 1 && <TabContainer><Score/></TabContainer>}
      </NoSsr>
    )

    return (
      <MuiThemeProvider theme={insighttheme}>
          {(this.props.data.loading && rows !== null) ?
            <NoSsr>
                <AppBar position="static">
                  <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
                    <LinkTab disabled={true} label="Summary" href="page1" />
                    <LinkTab disabled={true} label="Detail" href="page2" />
                  </Tabs>
                </AppBar>
                {value === 0 &&
                  <TabContainer>
                    <Grid container justify = "center" style={{marginTop:"50%"}}>
                      <CircularProgress className={classes.progress}/>
                    </Grid>
                  </TabContainer>}
                {value === 1 && <TabContainer><Score/></TabContainer>}
            </NoSsr>
            :
            null
          }

          {(!this.props.data.loading && this.props.data.error === null) ?
              <React.Fragment>
                <Newpage/>
              </React.Fragment>
              :null
          }

          {(this.props.data.error !== null) ?
              <ErrorPage/>:null
          }

      </MuiThemeProvider>

    );
  }
}
export default withStyles(styles)(InferenceTable);
