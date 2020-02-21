#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>


//  Firebase variables

#define FIREBASE_HOST "teminiproject-fcfff.firebaseio.com"
#define FIREBASE_AUTH "nLenYLrsS40Vflcf35wRrC1wbgsEg7pXO3L6Mji7"
#define WIFI_SSID "1 FLOOR"
#define WIFI_PASSWORD "12345678"
String USER = "/users/dsPiyFb16zenmdtAw2hXd9I6Xlf2/";
float electricityusage , electricitybalance;


//  ACS712 variables


#define acs712 A0
long lastSample = 0;
long sampleSum = 0;
int sampleCount = 0;
float vpc = 2.988;
long onwatttime, offwatttime;
float totalwattageperhour;
float offsetanalog, wattage;
bool bulbstatus;

// Flow variables
int flowPin = D2;
int flowrelay = D1;
double flowRate;
int count;
float waterusage, waterbalance, waterusageonce, lastvolume;
long onflowtime, offflowtime;
bool motorstatus;

// SETUP FUNCTION

void setup() {

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
  pinMode(D0, OUTPUT);
  pinMode(D1, OUTPUT);
  pinMode(flowPin, INPUT);
  attachInterrupt(D2, Flow, RISING);


  //CONNECT WITH FIREBASE

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  electricitybalance = Firebase.getFloat(USER + "currentelectricitybalance");
  waterusageonce = Firebase.getFloat(USER + "waterusage");
  waterbalance = Firebase.getFloat(USER + "currentwaterbalance");
  motorstatus = Firebase.getBool(USER + "motorstatus");
  if (electricitybalance < 0) {
    digitalWrite(D0, HIGH);
  }


}

//LOOP FUNCTION

void loop() {

  // Measure and upoad water usage

  waterbalance = Firebase.getFloat(USER + "currentwaterbalance");
  motorstatus = Firebase.getBool(USER + "motorstatus");
  Serial.println("balance" + String(waterbalance) + "motorstatus" + String(motorstatus));
  count = 0;
  interrupts();
  delay (1000);
  noInterrupts();
  flowRate = (count / 7.75);
  Serial.println(String(flowRate) + ("Lit/min"));

  if (flowRate == 0) {
    offflowtime = millis() - onflowtime;
  } else {
    onflowtime = millis() - offflowtime;
  }
  float volume = (flowRate * onflowtime) / 60000;
  Serial.println(volume, 5);
  if (motorstatus == false || waterbalance <= 0 ) {
    digitalWrite(flowrelay, HIGH);
  } else {
    digitalWrite(flowrelay , LOW);
  }
  if (waterbalance < 0) {
    Firebase.setFloat(USER + "currentwaterbalance", 0);
    Firebase.setBool(USER + "motorstatus", false);
  } else {
    waterbalance = waterbalance - (flowRate / 20); // one rupee per liter
    Firebase.setFloat(USER + "currentwaterbalance", waterbalance);
  }
  waterusage = waterusageonce + volume;
  if (volume > 0.5 && flowRate > 2.5) {
    lastvolume = volume;
    Firebase.setFloat(USER + "waterusage", waterusage);
  }
  if (volume < 0.5) {
    float tempvalue = waterusageonce + lastvolume;
    Firebase.setFloat(USER + "waterusage", tempvalue);
  }
  //Serial.println("lastvolume"+String(lastvolume)+"waterusageonce"+String(waterusageonce));


  // Measure and upload electricity usage


  if (digitalRead(D0) == HIGH) {
    offsetanalog = analogRead(A0);
  }
  if (digitalRead(D0) == LOW) {
    offsetanalog = 509;
  }
  if (sampleCount < 101) {
    for (int i = 0; i <= 100 ; i++) {
      sampleSum += sq(analogRead(acs712) - offsetanalog);
      sampleCount++;
      delay(1);
    }
  }
  if (sampleCount == 101) {
    Serial.println("samplecount is working");
    float mean = sampleSum / sampleCount;
    float value = sqrt(mean);
    float mv = value * vpc;
    float amperage = mv / 100;
    wattage = amperage * 220;
    if (wattage < 50) {
      offwatttime = millis();
    }
    if (wattage > 50) {
      onwatttime = millis() - offwatttime;
    }
    totalwattageperhour  = (wattage * onwatttime) / 3600000;
    Serial.println("wattage is" + String(wattage));
    float temp = analogRead(A0);
    Serial.println(temp);
    electricityusage = Firebase.getFloat(USER + "electricityusage");
    electricitybalance = Firebase.getFloat(USER + "currentelectricitybalance");
    bulbstatus = Firebase.getBool(USER + "bulbstatus");
    if (electricitybalance <= 0) {
      digitalWrite(D0, HIGH);
      Firebase.setFloat(USER + "currentelectricitybalance", 0);
      Firebase.setBool(USER + "bulbstatus" , false);
    } else {
      digitalWrite(D0, LOW);
    }
    if (bulbstatus == false) {
      digitalWrite(D0, HIGH);
      Firebase.setBool(USER + "bulbstatus" , false);
    } else {
      digitalWrite(D0, LOW);
    }
    if (totalwattageperhour > 0.18) {
      electricityusage += totalwattageperhour;/// catch here
      Serial.println("BULB Wattage is" + String(wattage));
      Serial.println("wattageperhour is " + String(totalwattageperhour) + "electricityusage up to time is" + String(electricityusage));
      Firebase.setFloat(USER + "electricityusage", electricityusage);
      electricitybalance = electricitybalance - totalwattageperhour; // 1 rupee for 1 wattperhour(WPH)
      Firebase.setFloat(USER + "currentelectricitybalance", electricitybalance);
    }
    sampleSum = 0;
    sampleCount = 0;
  }
}
void Flow()
{
  count++;
}
