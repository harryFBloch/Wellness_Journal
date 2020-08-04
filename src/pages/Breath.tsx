import React, { ReactElement, useState, useEffect } from 'react';
import { IonPage, IonText, IonButton } from '@ionic/react';
import { connect } from 'react-redux';
import { RootState, ThunkDispatchType, actions, Session } from '../store';
import { bindActionCreators } from 'redux';
import classes from './Breath.module.css';
import Timer from '../components/common/Timer';
import { RouteComponentProps } from 'react-router';

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

  const [breathIn, setBreathIn] = useState(true)

  useEffect(() => {
    if(current.sessionStarted && !current.sessionFinished) {
      setTimeout(() => { setBreathIn(!breathIn)}, 4000)
    }
  },[breathIn, current.sessionStarted, current.sessionFinished]);

  const handleBreathDone = () => {
    if (current.sessionStarted) {
      history.push('/home')
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
      <div className={classes.container}>
        <IonText>{breathIn ? 'Breath In...' : 'Breath Out...'}</IonText>
      </div>

      <div>
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
          <Timer mins={1} timerFinished={handleBreathDone}/>
        </div>
      </div>
    </>
  )

  return (
    <IonPage>
      <div className={classes.pageContainer}>
        <div>
          {current.sessionStarted && renderBreathing()}
          {!current.sessionStarted && renderStartButton()}
        </div>
      </div>
    </IonPage>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Breath)