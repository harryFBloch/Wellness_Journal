import React, { ReactElement, useEffect, useState } from 'react';
import { IonPage, IonGrid, IonRow, IonCol, IonButton, IonContent } from '@ionic/react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState, ThunkDispatchType, actions, History, SessionTemplate } from '../store';
import classes from './Stats.module.css'
import { RouteComponentProps } from 'react-router';
import Loading from '../components/common/Loading';

interface ReduxStateProps {
  sessionHistory: History;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  sessionHistory: state.sessions.history
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
}, dispatch);

interface MatchParams {
  id: string;
}
interface MatchProps extends RouteComponentProps<MatchParams>{}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps & MatchProps


export const Stats = ({ sessionHistory, match }: Props): ReactElement => {

  let [session, setSession] = useState({...SessionTemplate});
  let [spinner, setSpinner] = useState(true);

  
  useEffect(() => {
    if (sessionHistory && Object.keys(sessionHistory).length > 0) {
      setSession(sessionHistory[Number(match.params.id)])
      setSpinner(false)
    }
  }, [sessionHistory, match.params.id])

  const relDiff = (a: number, b: number) => {
    return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
   }

  const renderStats = (): ReactElement =>{

    return (
      <div className={classes.pageContainer}>
        <div className={classes.container}>
        <IonGrid>
          <IonRow>
            <IonCol size="12" className={classes.stat}>
            Mood Improvement
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className={`${classes.stat} ${classes.journal}`}>
              {`${session.beforeJournal}\n\n${session.afterJournal}`}
            </IonCol>
          </IonRow>
          <IonRow className={classes.statsContainer}>
            <IonCol className={classes.stat} size='6'>
              Anxiety: {~~relDiff(session.beforeMood.anxiety, session.afterMood.anxiety)}%
            </IonCol>
            <IonCol className={classes.stat} size='6'>
              Stress: {~~relDiff(session.beforeMood.stress, session.afterMood.stress)}%
            </IonCol>
          </IonRow>

          <IonRow className={classes.statsContainer}>
            <IonCol className={classes.stat} size='6'>
              Happiness: {~~relDiff(session.beforeMood.happiness, session.afterMood.happiness)}%
            </IonCol>
            <IonCol className={classes.stat} size='6'>
                Minutes: {session.sessionTime}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton routerLink="/home" routerDirection="none" className={classes.container}>
          Done
        </IonButton>
        </div>
      </div>
    )
  }
  

  return(
    <IonPage>
      <IonContent>
      {!spinner && renderStats()}
      {spinner && <Loading/>}
    </IonContent>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats)