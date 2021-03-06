import 'package:flutter/widgets.dart';

class SizeConfig {
  double screenWidth;
  double screenHeight;

  SizeConfig(this.screenWidth, this.screenHeight);

  static SizeConfig fromContext(BuildContext context) {
    final _mediaQueryData = MediaQuery.of(context);
    return SizeConfig(_mediaQueryData.size.width, _mediaQueryData.size.height);
  }
}
