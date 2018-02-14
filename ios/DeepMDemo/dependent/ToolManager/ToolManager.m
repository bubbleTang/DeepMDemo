//
//  ToolManager.m
//  DeepMDemo
//
//  Created by Huang on 2018/2/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ToolManager.h"

@implementation ToolManager

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport {
  return
  @{
    @"isIphoneX": iPhoneX ? @"true" : @"false"
    };
}

@end
