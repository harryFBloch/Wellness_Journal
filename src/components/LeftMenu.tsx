import React, { ReactElement, useEffect, useState } from 'react';
import { IonMenu, IonToolbar, IonHeader, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonText, IonMenuToggle, IonIcon, IonAlert } from '@ionic/react';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css"
import { bindActionCreators } from 'redux';
import { RootState, ThunkDispatchType, actions, Auth, History } from '../store';
import classes from './LeftMenu.module.css';
import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { logout } from '../store/auth/actions';
import { book } from 'ionicons/icons';

interface ReduxStateProps {
  products: IAPProduct[];
  removeAds: boolean;
  auth: Auth;
  sessionHistory: History;
};

const mapStateToProps = (state: RootState): ReduxStateProps => ({
  products: state.flags.products,
  removeAds: state.flags.removeAds,
  auth: state.auth,
  sessionHistory: state.sessions.history,
});

// Need to define types here because it won't infer properly from ThunkResult right now
interface ReduxDispatchProps {
  subscribe: (productID: string) => Promise<void>;
  initializeInter: () => Promise<void>;
  getHistory: () => Promise<boolean>;
  restorePurchase: () => Promise<void>;
}

const mapDispatchToProps = (dispatch: ThunkDispatchType): ReduxDispatchProps => bindActionCreators({
  subscribe: actions.flags.subscribe,
  initializeInter: actions.flags.initializeInter,
  getHistory: actions.sessions.getSessionHistory,
  restorePurchase: actions.flags.restorePurchase
}, dispatch);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const LeftMenu = ({ initializeInter, products, subscribe, removeAds, getHistory, auth, sessionHistory, restorePurchase }: Props): ReactElement => {

  const [alert, setAlert] = useState(false)

  const handleInitializeAd = () => {
    initializeInter()
  }

  useEffect(() => {
    if(auth.uid !== '') {
      console.log('start up')
      handleInitializeAd();
      getHistory()
      .then((hasHistory) => {
        !hasHistory && setAlert(true)
      })
    }
  }, [auth.uid])

  const renderProducts = (product: IAPProduct): ReactElement => {
    return(
      <IonButton className={classes.productButton} 
        onClick={() => subscribe(product.id)} key={product.id} 
        color="primary">
        {product.title} {product.price}/month
      </IonButton>
    )
  }

  const renderSessions = (): ReactElement => {
    return (
      <IonList className={classes.listContainer}>
        {Object.keys(sessionHistory).map((id) => 
          <IonItem lines='none' button detail={false} key={sessionHistory[Number(id)].id} color="secondary" routerDirection="none" routerLink={`/sessions/${id}`}>
            <IonLabel slot="start">
              {sessionHistory[Number(id)].beforeJournal}
            </IonLabel>
            <IonMenuToggle id="main" slot="end">
              <IonButton className={classes.icon} fill="outline" routerDirection="none" routerLink={`/sessions/${id}`}>
                <IonIcon icon={book} className={classes.icon}/>
              </IonButton>
            </IonMenuToggle>
          </IonItem>
        )}
      </IonList>
    )
  }

  return (
    <IonMenu side="start" menuId="left" contentId='main' color="secondary">
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Journals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="secondary">

        {renderSessions()}
        {!removeAds && products[0] && renderProducts(products[0])}
        <IonButton className={classes.productButton} onClick={restorePurchase}>Restore Purchases</IonButton>
        <IonButton className={classes.productButton} onClick={logout}>Logout</IonButton>
      </IonContent>
    </IonMenu>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);