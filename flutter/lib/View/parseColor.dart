import 'package:flutter/material.dart';

Color? parseColor(String? color) {
  if (color == null) {
    return null;
  }

  String hex = color.replaceAll("#", "");
  if (hex.length == 3) {
    hex =
        '${hex.substring(0, 1)}${hex.substring(0, 1)}${hex.substring(1, 2)}${hex.substring(1, 2)}${hex.substring(2, 3)}${hex.substring(2, 3)}';
  }
  Color col = Color(int.parse(hex, radix: 16)).withOpacity(1.0);
  return col;
}
