import React, { ReactElement, useState } from 'react'
import classes from './GetMood.module.css'
import { IonPage, IonText, IonList, IonItemDivider, IonItem, IonRange, IonLabel, IonContent, IonButton } from '@ionic/react'
import { connect } from 'react-redux';
import { RootState, ThunkDispatchType, actions, Mood, Session, History } from '../store';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { showInterAd } from '../store/flags/actions';

interface ReduxStateProps {
  current: Session;
  sessionHistory: History;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  current: state.sessions.current,
  sessionHistory: state.sessions.history,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  createSession: (mood: Mood, sessionTime: number) => Promise<void>;
  createJournal: (journal: string, mood: Mood) => Promise<void>;
  finishSession: () => Promise<number>;
  addMood: (mood: Mood) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  createSession: actions.sessions.createSession,
  createJournal: actions.sessions.addJournal,
  finishSession: actions.sessions.finishSession,
  addMood: actions.sessions.addMood
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps


export const GetMood = ({ createSession, current, finishSession, sessionHistory, addMood }: Props): ReactElement => {

  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [happiness, setHappiness] = useState(5);
  const [minutes, setMinutes] = useState(5);

  const handleButtonPress = (): void => {
    if (!current.sessionStarted) {
      createSession({anxiety: anxiety, stress: stress, happiness: happiness}, minutes);
    } else {
      showInterAd();
      addMood({anxiety: anxiety, stress: stress, happiness: happiness})
      finishSession()
      setAnxiety(5);
      setHappiness(5);
      setStress(5);
      setMinutes(5);
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className={classes.buttonContainer}>
          <IonText className={classes.label}>How Are You Feeling Now?</IonText>
        </div>
        <IonList className={classes.listContainer}>
          <IonItemDivider className={classes.moodTitle}>Anxiety Level</IonItemDivider>
          <IonItem lines="full">
            <IonRange pin min={0} max={10} ticks snaps value={anxiety}
            onIonChange={(e) => setAnxiety(e.detail.value as number)}
            >
              <IonLabel color="primary" slot="start">0</IonLabel>
              <IonLabel color="primary" slot="end">10</IonLabel>
            </IonRange>
          </IonItem>

          <IonItemDivider className={classes.moodTitle}>Stress Level</IonItemDivider>
          <IonItem lines="full">
            <IonRange pin min={0} max={10} ticks snaps value={stress}
            onIonChange={(e) => setStress(e.detail.value as number)}
            >
              <IonLabel color="primary" slot="start">0</IonLabel>
              <IonLabel color="primary" slot="end">10</IonLabel>
            </IonRange>
          </IonItem>

          <IonItemDivider className={classes.moodTitle}>Happiness Level</IonItemDivider>
          <IonItem lines="full">
            <IonRange pin min={0} max={10} ticks snaps value={happiness}
            onIonChange={(e) => setHappiness(e.detail.value as number)}
            >
              <IonLabel color="primary" slot="start">0</IonLabel>
              <IonLabel color="primary" slot="end">10</IonLabel>
            </IonRange>
          </IonItem>

          {!current.sessionStarted && 
          <>
            <IonItemDivider className={classes.moodTitle}>Session Time</IonItemDivider>
            <IonItem lines="full">
              <IonRange pin min={1} max={20} ticks snaps value={minutes}
              onIonChange={(e) => setMinutes(e.detail.value as number)}
              >
                <IonLabel color="primary" slot="start">0</IonLabel>
                <IonLabel color="primary" slot="end">20</IonLabel>
              </IonRange>
            </IonItem>
          </>
          }
        </IonList>

        <div className={classes.buttonContainer}>
          <IonButton onClick={handleButtonPress} className={classes.button} 
          routerLink={current.sessionStarted ? `/sessions/${current.id}` : '/journal'}>
             {current.sessionStarted ? 'Finish' : 'Start Session'}
          </IonButton>
        </div>

      </IonContent>

    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(GetMood)