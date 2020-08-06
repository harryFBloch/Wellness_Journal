import { IonPage, IonButton, IonMenuButton, IonIcon, IonContent, IonText } from '@ionic/react';
import React, { ReactElement } from 'react';
import classes from './Home.module.css';
import { RootState, ThunkDispatchType, actions, History } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { statsChart} from 'ionicons/icons';
import Toolbar from '../components/common/Toolbar';
import LineGraph from '../components/LineGraph';
import { getZenScoreData, getAverage, getAverageZen } from '../utils/stats';
import Reminder from '../components/common/Reminder';
import { subscribe } from '../store/flags/actions';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';

interface ReduxStateProps {
  sessionHistory: History;
  products: IAPProduct[];
  removeAds: boolean;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  sessionHistory: state.sessions.history,
  products: state.flags.products,
  removeAds: state.flags.removeAds
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps

const Home = ({ showInter, sessionHistory, products, removeAds}: Props): ReactElement => {
  
  const renderStats = (): ReactElement => (
    <div className={classes.container}>
        <div className={classes.statRow}>
          <div className={classes.stat}>
            <div className={classes.statNumber}>{getAverageZen(sessionHistory)}</div>
            <div className={classes.statTitle}>Average Wellness Score</div>
          </div>
          <div className={classes.stat}> 
            <div className={classes.statNumber}>{getAverage(sessionHistory, 'anxiety')}</div>
            <div className={classes.statTitle}>Average Anxiety</div>
          </div>
        </div>
        <div className={classes.statRow}> 
          <div className={classes.stat}> 
          <div className={classes.statNumber}>{getAverage(sessionHistory, 'stress')}</div>
            <div className={classes.statTitle}>Average Stress</div>
          </div>
          <div className={classes.stat}> 
          <div className={classes.statNumber}>{getAverage(sessionHistory, 'happiness')}</div>
            <div className={classes.statTitle}>Average Happiness</div>
          </div>
        </div>
      </div>
  )
    
  return (
    <IonPage>
      <Toolbar rightButtons={
        <IonMenuButton menu="right" autoHide={false}>
          <IonIcon icon={statsChart}/>
        </IonMenuButton>}/>
        <IonContent>
          <div className={classes.pageContainer}>
            <div className={classes.container}>
              {Object.keys(sessionHistory).length > 0 &&
              <>
                <div className={classes.graphContainer}>
                  <LineGraph data={getZenScoreData(sessionHistory)} title="Wellness Score" fill/>
                </div>
                {renderStats()}
              </>
              }
              {Object.keys(sessionHistory).length === 0 && <>
                <IonText className={classes.message}>Lets get started by setting a reminder and starting our first session!</IonText>
                <Reminder color1='tertiary' color2="primary"/></>}
            <IonButton routerLink="/getmood" routerDirection="none" className={`${classes.button} ${classes.bold}`}>
              Start Session
            </IonButton>
            {products[0] && !removeAds &&
              <IonButton className={classes.button}
                onClick={() => subscribe(products[0].id)} key={products[0].id} 
                color="primary">
                {products[0].title} {products[0].price}/{products[0].billingPeriodUnit}
              </IonButton>
            }
            </div>
          </div>
        </IonContent>
    </IonPage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
