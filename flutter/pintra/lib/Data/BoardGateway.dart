import 'dart:convert';
import 'package:flutter/services.dart' show AssetBundle, rootBundle;
import 'package:pintra/Data/BoardModel.dart';

Future<Board> loadBoard({required AssetBundle assetBundle}) async {
  final fileContents = await assetBundle.loadString('assets/board.json');
  final boardJson = json.decode(fileContents);

  return Board.fromJson(boardJson);
}
