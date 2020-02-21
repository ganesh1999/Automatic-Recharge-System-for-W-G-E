#include <ESP8266WiFi.h>                                           
#include <FirebaseArduino.h>                                         

#define FIREBASE_HOST "teminiproject-fcfff.firebaseio.com"                       
#define FIREBASE_AUTH "nLenYLrsS40Vflcf35wRrC1wbgsEg7pXO3L6Mji7"   
#define WIFI_SSID "1 FLOOR"    
#define WIFI_PASSWORD "12345678"  
int temp = 0;

                                                                                 // SETUP FUNCTION
 
void setup(){
  
                                                                               //CONNECT TO WIFI ROUTER
                                   
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
  

                                                                                 //CONNECT WITH FIREBASE

               
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);      
  
}

                                                                                    //LOOP FUNCTION

void loop() {
  
  Firebase.setInt("TEMPINT",temp);
  temp++;
  delay(2000);
  
}
