import React, { ReactElement, useState, useEffect } from 'react'
import { IonTextarea, IonButton, IonPage, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { getRandomPrompt } from '../store/session/actions';
import Loading from '../components/common/Loading';
import classes from './Journal.module.css'
import { RootState, ThunkDispatchType, Session, actions } from '../store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

interface ReduxStateProps {
  current: Session;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  current: state.sessions.current,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  createJournal: (journal: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  createJournal: actions.sessions.addJournal,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>


export const Journal = ({ current, createJournal, showInter }: Props): ReactElement => {

  const [journal, setJournal] = useState('');
  const [prompt, setPrompt] = useState('')
  
  useEffect(() => {
    getRandomPrompt()
    .then((data) => setPrompt(data))
  }, [])

  useEffect(() => {
    if(current.sessionStarted) {
      getRandomPrompt()
      .then((data) => setPrompt(data))
    }
  }, [current.sessionStarted])

  const handleButtonPress = () => {
    !current.sessionStarted && showInter()
    createJournal(journal)
    setJournal('')
    getRandomPrompt()
    .then((data) => setPrompt(data))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Journal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        { prompt !== '' &&
        <div className={classes.pageContainer}>
          <div className={classes.fullWidth}>
            <div className={classes.fullWidth}>
                <div className={classes.contaiiner}>
                  <IonTextarea className={classes.journal} value={journal} onIonChange={(e) => setJournal(e.detail.value!)}
                  placeholder={prompt} rows={10}
                  />
                </div>
              </div>
            <div className={classes.buttonContainer}>
              <IonButton className={classes.fullWidth} disabled={journal === ''} routerDirection="none" routerLink={current.sessionStarted ? '/getmood' : '/breath'}
              onClick={handleButtonPress}>Next</IonButton>
            </div>
          </div>
        </div>
          }
          {prompt === '' && <Loading/>}
      </IonContent>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Journal);