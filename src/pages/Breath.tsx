import React, { ReactElement, useState, useEffect } from 'react';
import { IonPage, IonText, IonButton, IonContent, IonToolbar } from '@ionic/react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import { RootState, ThunkDispatchType, actions, Session } from '../store';
import classes from './Breath.module.css';
import Timer from '../components/common/Timer';
import { getRandomQuote } from '../store/session/actions';
import Toolbar from '../components/common/Toolbar';

interface ReduxStateProps {
  current: Session;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  current: state.sessions.current,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  showInter: () => Promise<void>;
  startSession: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  showInter: actions.flags.showInterAd,
  startSession: actions.sessions.startSession,
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps


export const Breath = ({ current, startSession, history }: Props): ReactElement => {

  const [breathIn, setBreathIn] = useState(true);
  const [timerOn, setTimerOn] = useState(false);
  const [quote, setQuote] = useState({quote: '', author: ''});

  useEffect(() => {
    if(current.sessionStarted) {
      console.log('start breathiing')
      setTimeout(() => { setBreathIn(!breathIn)}, 4000);
    }
  },[breathIn, current.sessionStarted]);

  useEffect(() => {
    if(current.sessionStarted) {
      setTimerOn(true)
    }
  }, [current.sessionStarted])

  useEffect(() => {
    getRandomQuote()
    .then((data) => setQuote(data))
  }, [])

  const handleBreathDone = () => {
    if (current.sessionStarted && timerOn) {
      setTimerOn(false);
      history.push('/journal')
    }
  }

  const handleStartBreathing = () => {
    startSession()
  }

  const renderStartButton = (): ReactElement => (
    <>
      <div className={classes.container}>
        <IonText>When Your Ready To Begin Quiet Your Mind and Breathe...</IonText>
        <div className={classes.container}>
          <IonButton onClick={handleStartBreathing}>Get Started!</IonButton>
        </div>
      </div>
    </>
  )

  const renderBreathing = (): ReactElement => (
    <>
      {quote.quote !== '' && 
        <div className={classes.container}>
          <div className={classes.quote}>{quote.quote}</div>
          <div className={classes.author}>{quote.author}</div>
        </div>
      }
      <div className={classes.container}>
        <IonText>{breathIn ? 'Breath In...' : 'Breath Out...'}</IonText>
      </div>

      <div className={classes.center}>
        <div className={classes.cloneCircleContainer}>
            <div className={`${ classes.circle} ${classes.circleClone}
            ${breathIn ? classes.scaleIn : classes.scaleOut}`}
                style={{animationDelay: '0s'}}/>

            <div className={`${classes.scoreCounter} 
              ${classes.circle} ${classes.circleClone}
              ${breathIn ? classes.scaleIn : classes.scaleOut}`}
              style={{animationDelay: '0.5s'}}/>
            
            <div className={`${classes.scoreCounter} 
              ${classes.circle} ${classes.circleClone}
              ${breathIn ? classes.scaleIn : classes.scaleOut}`}
              style={{animationDelay: '1.0s'}}/>
            
            <div className={`${classes.scoreCounter} 
              ${classes.circle} ${classes.circleClone}
              ${breathIn ? classes.scaleIn : classes.scaleOut}`}
              style={{animationDelay: '1.5s'}}/>

            <div className={`${classes.scoreCounter} 
              ${classes.circle} ${classes.circleClone}
              ${breathIn ? classes.scaleIn : classes.scaleOut}`}
              style={{animationDelay: '2.0s'}}/>
          </div>
        <div className={classes.circle}>
          {timerOn && <Timer mins={current.sessionTime} timerFinished={handleBreathDone}/>}
        </div>
      </div>
    </>
  )

  return (
    <IonPage>
      <Toolbar blank rightButtons={<IonButton onClick={handleBreathDone}>Cancel</IonButton>}/>
      <IonContent>
        <div className={classes.pageContainer}>
          <div>
            {timerOn && renderBreathing()}
            {!current.sessionStarted && renderStartButton()}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Breath)