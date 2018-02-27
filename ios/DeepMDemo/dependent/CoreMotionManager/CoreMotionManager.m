//
//  CoreMotionManager.m
//  DeepMDemo
//
//  Created by Huang on 2018/2/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CoreMotionManager.h"
#import <CoreMotion/CoreMotion.h>
#import <UIKit/UIKit.h>
#import <React/RCTLog.h>
#import <React/RCTBridge.h>

@interface CoreMotionManager ()

@property(strong,nonatomic) CMMotionManager* motionManager;

@end

@implementation CoreMotionManager{
  bool hasListeners;
}

RCT_EXPORT_MODULE();

+ (instancetype)sharedInstance {
  static dispatch_once_t onceToken;
  static CoreMotionManager *instance = nil;
  dispatch_once(&onceToken, ^{
    instance = [[CoreMotionManager alloc] init];
  });
  return instance;
}

RCT_EXPORT_METHOD(startHandling) {
  RCTLog(@"开始监听");
  
  self.motionManager = [[CMMotionManager alloc] init];
  NSOperationQueue *queue = [[NSOperationQueue alloc] init];
  
  if (self.motionManager.accelerometerAvailable) {
    //设置CMMotionManager的加速度数据更新频率为0.1秒
    self.motionManager.accelerometerUpdateInterval = 1;
   
    [self.motionManager startAccelerometerUpdatesToQueue:queue withHandler:^(CMAccelerometerData * _Nullable accelerometerData, NSError * _Nullable error) {
      NSString *labelText;
  
      if (error) {
        //停止获取加速度数据
        [self.motionManager stopAccelerometerUpdates];
        labelText = [NSString stringWithFormat:@"获取加速度数据出现错误:%@",error];
      } else {
        //分别获取系统在XYZ轴上的加速度数据
//        labelText = [NSString stringWithFormat:@"加速度为\n---------\nX轴：%+.2f\nY轴：%+.2f\nZ轴：%+.2f",accelerometerData.acceleration.x,accelerometerData.acceleration.y,accelerometerData.acceleration.z];
        if (accelerometerData.acceleration.z > 0.85) {
          [self sendCoreMotionEventWithName:[NSString stringWithFormat:@"FaceDown"]];
        } else {
          [self sendCoreMotionEventWithName:[NSString stringWithFormat:@"FaceUp"]];
        }
      }
//      RCTLog(@"%@", labelText);
    }];
  } else {
    RCTLog(@"该设备不支持获取加速度数据！");
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FaceDown", @"FaceUp"];
}

-(void)sendCoreMotionEventWithName: (NSString *)name {
  [self sendEventWithName:name body:[NSDictionary dictionary]];
}

@end
