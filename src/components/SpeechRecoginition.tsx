import { IonContent, IonPage, IonButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

const SpeechRecoginitionComponent: React.FC = () => {
  const [transscript, setTranssrcript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  useEffect(() => {
    SpeechRecognition.requestPermission();
  }, []);
  const startRecognition = async (): Promise<void> => {
    const available = await SpeechRecognition.available();
    if (available) {
      SpeechRecognition.start({
        language: 'en-US',
        maxResults: 2,
        prompt: 'Say something',
        partialResults: true,
        popup: true,
      });
    }
    SpeechRecognition.addListener('partialResults', (data) => {
      console.log(data);
    });
  };
  const StopRecognition = async (): Promise<void> => {
    await SpeechRecognition.stop();
    setIsSpeaking(true);
  };
  return (
    <IonPage>
      <IonContent>
        <IonButton onClick={startRecognition}>Start</IonButton>
        <IonButton onClick={StopRecognition}>Stop</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SpeechRecoginitionComponent;
