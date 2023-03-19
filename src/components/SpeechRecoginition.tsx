import {
  IonContent,
  IonPage,
  IonButton,
  IonSpinner,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  useIonToast,
} from '@ionic/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import './SpeechRecognition.css';
interface DataI {
  item_name: string;
  qty: number;
  mrp: number;
  rate: number;
  cost: number;
}
const SpeechRecoginitionComponent: React.FC = () => {
  const [transscript, setTranssrcript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [data, setData] = useState<DataI[] | null>(null);
  const [filteredData, setFilterData] = useState<DataI[]>([]);
  const [present] = useIonToast();
  useEffect(() => {
    fetch('./assets/data.json')
      .then((res) => res.json())
      .then((result: DataI[]) => {
        console.log(result);
        setData(result);
        setFilterData(result);
      });
    SpeechRecognition.requestPermission();
  }, []);
  const presentToast = (
    position: 'top' | 'middle' | 'bottom',
    message: string
  ) => {
    present({
      message: message,
      duration: 2500,
      position: position,
    });
  };

  const startRecognition = async (): Promise<void> => {
    try {
      const available = await SpeechRecognition.available();
      if (available) {
        setIsSpeaking(true);
        SpeechRecognition.start({
          language: 'en-IN',
          // maxResults: 2,
          prompt: 'Say medicine name',
          partialResults: false,
          popup: false,
        })
          .then(async (result) => {
            console.log('then result', result);
            if (result.matches && result.matches.length > 0) {
              filtering(result.matches[0]);
            }

            console.log(result);
            await StopRecognition();
            setIsSpeaking(false);
          })
          .catch(async (err) => {
            console.log(err);
            await StopRecognition();
          });

        // if (result.matches && result.matches.length > 0) {
        //   filtering(result.matches[0]);
        //   setTranssrcript(result.matches[0]);
        // }
        // console.log(result);
        // await StopRecognition();
      }

      // SpeechRecognition.addListener('partialResults', async (result) => {
      //   console.log(result);
      //   if (result.matches && result.matches.length > 0) {
      //     filtering(result.matches[0]);
      //     setTranssrcript(result.matches[0]);
      //   }
      //   console.log(result);
      //   await StopRecognition();
      // });
    } catch (err) {
      console.log(err);
      presentToast(
        'top',
        'Something went wrong while trying to listen either you havent given permission or trying on web'
      );
    }
  };
  const StopRecognition = async (): Promise<void> => {
    setIsSpeaking(false);
    await SpeechRecognition.stop();
  };
  const filtering = (e: any) => {
    console.log(e);
    // const result: any = data?.filter((obj) =>
    //   Object.values(obj.item_name).some((val) => val.includes(e))
    // );
    // console.log(result);
    const result1: any = data?.filter((obj) => {
      if (obj.item_name.search(e.toUpperCase()) !== -1) {
        return true;
      } else {
        return false;
      }
    });
    console.log(result1);
    setTranssrcript(e);
    setFilterData(result1);
  };
  return (
    <IonPage>
      <IonContent>
        <div className='btn-container'>
          {!isSpeaking ? (
            <IonButton onClick={startRecognition}>Start</IonButton>
          ) : (
            <IonButton>Listening</IonButton>
          )}
          <IonButton
            onClick={() => {
              filtering(' ');
            }}
          >
            Clear all
          </IonButton>
        </div>
        {/* <IonInput placeholder='Enter text' onInput={filtering}></IonInput> */}
        {isSpeaking && (
          <div className='listen-spinner'>
            I am listening
            <IonSpinner name='dots'></IonSpinner>
          </div>
        )}
        {transscript && <div>{transscript}</div>}
        {data && (
          <div className='table'>
            <IonGrid>
              <IonRow>
                <IonCol>Item Name</IonCol>
                <IonCol>Quantity</IonCol>
                <IonCol>M.R.P</IonCol>
                <IonCol>Cost</IonCol>
                <IonCol>Rate</IonCol>
              </IonRow>
              {filteredData.map((d: DataI, index) => {
                return (
                  <IonRow key={index}>
                    <IonCol>{d.item_name}</IonCol>
                    <IonCol>{d.qty}</IonCol>
                    <IonCol>{d.mrp}</IonCol>
                    <IonCol>{d.cost}</IonCol>
                    <IonCol>{d.rate}</IonCol>
                  </IonRow>
                );
              })}
            </IonGrid>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SpeechRecoginitionComponent;
