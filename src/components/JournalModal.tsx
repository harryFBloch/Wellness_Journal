import React, { ReactElement, useState } from 'react'
import classes from './JournalModal.module.css'
import { IonModal, IonTextarea, IonText, IonButton } from '@ionic/react';

interface ComponentProps {
  isOpen: boolean;
  handleSubmit: (journal: string) => void;
}

export const JournalModal = ({ isOpen, handleSubmit}: ComponentProps): ReactElement => {

  const [journal, setJournal] = useState('');

  return (
    <IonModal isOpen={isOpen} cssClass={classes.modal}>
      <div>
        <div className={classes.contaiiner}>
          <IonText className={classes.prompt}>Random Prompt.....</IonText>
        </div>
        <div className={classes.contaiiner}>
          <IonTextarea className={classes.journal} value={journal} onIonChange={(e) => setJournal(e.detail.value!)}
          autoGrow placeholder="Random Prompt"/>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <IonButton className={classes.button} disabled={journal === ''}
        onClick={() => {
          setJournal('');
          handleSubmit(journal)
          }}>Start Breathing</IonButton>
      </div>
    </IonModal>
  )
}

export default JournalModal;