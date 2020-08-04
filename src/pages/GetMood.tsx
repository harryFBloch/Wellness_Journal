import React, { ReactElement, useState } from 'react'
import classes from './GetMood.module.css'
import { IonPage, IonText, IonList, IonItemDivider, IonItem, IonRange, IonLabel, IonDatetime, IonContent, IonButton, IonAlert } from '@ionic/react'
import { connect } from 'react-redux';
import { RootState, ThunkDispatchType, actions, Mood } from '../store';
import { bindActionCreators } from 'redux';
import JournalModal from '../components/JournalModal';
import { RouteComponentProps } from 'react-router';

interface ReduxStateProps {
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  createSession: (mood: Mood, sessionTime: number) => Promise<void>;
  createJournal: (journal: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  createSession: actions.sessions.createSession,
  createJournal: actions.sessions.addJournal,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps


export const GetMood = ({ createSession, createJournal, history }: Props): ReactElement => {

  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [happiness, setHappiness] = useState(5);
  const [minutes, setMinutes] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  const handleStartSession = (): void => {
    setOpenModal(true);
    createSession({anxiety: anxiety, stress: stress, happiness: happiness}, minutes);
  }

  const handleFinishJournal = (journal: string): void => {
    setOpenModal(false);
    createJournal(journal);
    history.push('./breath');
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

          <IonItemDivider className={classes.moodTitle}>Session Time</IonItemDivider>
          <IonItem lines="full">
            <IonRange pin min={1} max={30} ticks snaps value={minutes}
            onIonChange={(e) => setMinutes(e.detail.value as number)}
            >
              <IonLabel color="primary" slot="start">0</IonLabel>
              <IonLabel color="primary" slot="end">30</IonLabel>
            </IonRange>
          </IonItem>
        </IonList>

        <div className={classes.buttonContainer}>
          <IonButton onClick={handleStartSession} className={classes.button}>
            Start Session
          </IonButton>
        </div>

      </IonContent>
      <JournalModal isOpen={openModal} handleSubmit={handleFinishJournal}/>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(GetMood)