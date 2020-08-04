import { IonPage, IonButton } from '@ionic/react';
import React, { ReactElement } from 'react';
import classes from './Home.module.css';
import { RootState, ThunkDispatchType, actions } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import {checkmarkCircle, hammerOutline, trashBinOutline, arrowUndoCircle, addOutline} from 'ionicons/icons';
import Toolbar from '../components/common/Toolbar';

interface ReduxStateProps {
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const Home = ({ showInter}: Props): ReactElement => {

  
  return (
    <IonPage>
      <Toolbar />
      <div className={classes.pageContainer}>
      <IonButton routerLink="/getmood" routerDirection="none">Start Session</IonButton>
      </div>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
