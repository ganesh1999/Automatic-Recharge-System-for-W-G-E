#include <ESP8266WiFi.h>                                           
#include <FirebaseArduino.h>          

                               
                                                                               //  Firebase variables

#define FIREBASE_HOST "teminiproject-fcfff.firebaseio.com"                       
#define FIREBASE_AUTH "nLenYLrsS40Vflcf35wRrC1wbgsEg7pXO3L6Mji7"   
#define WIFI_SSID "1 FLOOR"    
#define WIFI_PASSWORD "12345678"  
String USER = "/users/dsPiyFb16zenmdtAw2hXd9I6Xlf2/";


int flowPin = D2;
int flowrelay = D1;
double flowRate;
int count;
float waterusage, waterbalance, waterusageonce, lastvolume;
long onflowtime, offflowtime;
bool motorstatus;

void setup() {
  Serial.begin(9600);
        delay(1000);         
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        Serial.print("Connecting to ");
        Serial.print(WIFI_SSID);
        while (WiFi.status() != WL_CONNECTED) {
          Serial.print(".");
          delay(500);
        }
        Serial.println();
        Serial.print("Connected to ");
        Serial.println(WIFI_SSID);
        Serial.print("IP Address is : ");
        Serial.println(WiFi.localIP()); 
        pinMode(D1, OUTPUT);
        pinMode(flowPin, INPUT);         
        attachInterrupt(D2, Flow, RISING);
        
      
                                                                                //CONNECT WITH FIREBASE
      
        Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
        waterusageonce = Firebase.getFloat(USER+"waterusage");
        waterbalance = Firebase.getFloat(USER+"currentwaterbalance");
        motorstatus = Firebase.getBool(USER+"motorstatus");
        
        
         
}
void loop() {
  waterbalance = Firebase.getFloat(USER+"currentwaterbalance");
  motorstatus = Firebase.getBool(USER+"motorstatus");
  Serial.println("balance"+String(waterbalance)+"motorstatus"+String(motorstatus));
  count = 0;      
  interrupts();  
  delay (1000);     
  noInterrupts();
  flowRate = (count / 7.75);  
  Serial.println(String(flowRate)+("Lit/min"));
  if(flowRate == 0){
    offflowtime = millis() - onflowtime;
  }
  else{
    onflowtime = millis() - offflowtime;
  }
  float volume = (flowRate * onflowtime)/60000;
  Serial.println(volume,5);
  if(motorstatus == false || waterbalance<=0 ){
    digitalWrite(flowrelay, HIGH);
    }else{digitalWrite(flowrelay ,LOW);}
    if(waterbalance < 0){
      Firebase.setFloat(USER+"currentwaterbalance",0);
      Firebase.setBool(USER+"motorstatus",false);
      }else{
        waterbalance = waterbalance - (flowRate/20); // one rupee per liter
        Firebase.setFloat(USER+"currentwaterbalance", waterbalance);
        }
    waterusage = waterusageonce + volume;
    if(volume > 0.5 && flowRate > 2.5){
      lastvolume = volume;
      Firebase.setFloat(USER+"waterusage", waterusage);
      }if(volume<0.5){
        float tempvalue = waterusageonce + lastvolume;
        Firebase.setFloat(USER+"waterusage", tempvalue);
        }
        Serial.println("lastvolume"+String(lastvolume)+"waterusageonce"+String(waterusageonce));
    
    
}
 
void Flow()
{
   count++; 
}
