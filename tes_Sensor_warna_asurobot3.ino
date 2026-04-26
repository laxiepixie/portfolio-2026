#include <Wire.h>
#include <Adafruit_TCS34725.h>

#define SDA_PIN 20 // Hubungkan SDA sensor ke pin A4 Arduino
#define SCL_PIN 21 // Hubungkan SCL sensor ke pin A5 Arduino

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

void setup() {
  Serial.begin(9600);
  if (tcs.begin()) {
    Serial.println("Sensor TCS34725 ditemukan.");
  } else {
    Serial.println("Sensor TCS34725 tidak ditemukan. Periksa koneksi.");
    while (1);
  }
}

void loop() {
  uint16_t r, g, b, c;
  tcs.getRawData(&r, &g, &b, &c);
  
  Serial.print("Warna: ");
  if (c > 200) {
    float red = float(r) / float(c);
    float green = float(g) / float(c);
    float blue = float(b) / float(c);
    
    if (red > green && red > blue) {
      Serial.println("Merah");
    } else if (green > red && green > blue) {
      Serial.println("Hijau");
    } else if (blue > red && blue > green) {
      Serial.println("Biru");
    } else {
      Serial.println("Warna lain");
    }
  } else {
    Serial.println("Tidak ada objek yang terdeteksi.");
  }

  delay(1000);
}
