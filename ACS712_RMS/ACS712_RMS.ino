

#define acs712 A0
float result;
    long lastSample = 0;
    long sampleSum = 0;
    int sampleCount = 0;
    float vpc = 2.988;
    long onwatttime, offwatttime;
    float totalwattageperhour;
  

void setup() {
 Serial.begin(9600);
 pinMode(2,OUTPUT);
 digitalWrite(2,LOW);
}

void loop() {

  totalwattageperhour = getWatt();
  Serial.println(totalwattageperhour); 
  
   }

float getWatt(){
    
    if(millis() > lastSample +1){
    sampleSum += sq(analogRead(acs712) -825);
    sampleCount++;
    lastSample = millis();
   }
   if(sampleCount == 100){
    float mean = sampleSum / sampleCount;
    float value = sqrt(mean);
    float mv = value * vpc;
    float amperage = mv/100;
    float wattage = amperage * 220;
    if(wattage < 25){ offwatttime = millis();}
    if(wattage > 25){onwatttime = millis() - offwatttime;}
    result  = (wattage * onwatttime)/3600000;
    sampleSum = 0;
    sampleCount = 0;
  }
  return result;
   
   
}
