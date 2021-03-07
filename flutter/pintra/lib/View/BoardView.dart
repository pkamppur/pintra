import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:pintra/Data/BoardModel.dart' as Model;
import 'package:pintra/View/SizeConfig.dart';
import 'package:pintra/View/colorUtils.dart';

class BoardView extends StatefulWidget {
  BoardView({Key? key, required this.board}) : super(key: key);

  final Model.Board board;

  @override
  _BoardViewState createState() => _BoardViewState(board: board);
}

class _BoardViewState extends State<BoardView> {
  final Model.Board board;

  _BoardViewState({required this.board});

  @override
  Widget build(BuildContext context) {
    final sizeConfig = SizeConfig.fromContext(context);

    return SizedBox.expand(
        child: SingleChildScrollView(
            child: Container(
      decoration: BoxDecoration(color: Color(0xffeeeeee)),
      child: Column(
          children: [
        ...board.sections.expand((section) => [
              SectionView(section: section, sizeConfig: sizeConfig),
              SizedBox(height: 30)
            ])
      ].toList()),
    )));
  }
}

class SectionView extends StatelessWidget {
  SectionView({Key? key, required this.section, required this.sizeConfig})
      : super(key: key);

  final Model.Section section;
  final SizeConfig sizeConfig;

  @override
  Widget build(BuildContext context) {
    final _columnCount = columnCount(sizeConfig.screenWidth);
    final rows = chunked(section.cards, _columnCount);
    final double cardInset = 8;

    final dialog = (Model.Card card) => SimpleDialog(
            titlePadding: EdgeInsets.zero,
            insetPadding: EdgeInsets.zero,
            title: Container(
                decoration: BoxDecoration(color: Color(0xFF000000)),
                child: Column(children: [
                  Text("${card.name}",
                      style: TextStyle(color: Color(0xFFFFFFFF))),
                ])),
            children: [
              SizedBox(
                  width: min(sizeConfig.screenWidth, 600),
                  child: Container(
                      padding: EdgeInsets.all(20),
                      child: Column(
                          children: [MarkdownBody(data: card.content)]))),
            ]);

    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionNameView(
              title: section.name,
              textColor: section.textColor,
              backgroundColor: section.backgroundColor),
          ...rows.map((row) => Container(
              padding: EdgeInsets.only(left: cardInset, right: cardInset),
              child: Row(
                  children: row
                      .map((card) => SizedBox(
                          width: (sizeConfig.screenWidth - cardInset * 2) /
                              _columnCount,
                          child: GestureDetector(
                            onTap: () {
                              showDialog<void>(
                                  context: context,
                                  builder: (context) => dialog(card));
                            },
                            child: CardView(title: card.name),
                          )))
                      .toList()))),
        ].toList());
  }
}

int columnCount(double width) {
  if (width < 600) {
    return 2;
  } else if (width < 800) {
    return 3;
  } else if (width < 1100) {
    return 4;
  } else if (width < 1300) {
    return 5;
  } else {
    return 6;
  }
}

List<List<T>> chunked<T>(List<T> list, int chunkSize) {
  var len = list.length;
  List<List<T>> chunks = [];

  for (var i = 0; i < len; i += chunkSize) {
    var end = (i + chunkSize < len) ? i + chunkSize : len;
    chunks.add(list.sublist(i, end));
  }
  return chunks;
}

class SectionNameView extends StatelessWidget {
  SectionNameView(
      {Key? key, required this.title, this.textColor, this.backgroundColor})
      : super(key: key);

  final String title;
  final String? textColor;
  final String? backgroundColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: double.infinity,
        child: Container(
          padding: EdgeInsets.all(8),
          margin: EdgeInsets.all(8),
          decoration: BoxDecoration(
              color: parseColor(backgroundColor) ?? Color(0x00000000),
              borderRadius: BorderRadius.all(Radius.circular(5))),
          child: Text(title,
              style: TextStyle(
                  fontSize: 18,
                  color: parseColor(textColor) ?? Color(0xFF000000))),
        ));
  }
}

class CardView extends StatelessWidget {
  CardView({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(8),
      margin: EdgeInsets.all(8),
      decoration: BoxDecoration(
          color: Color(0xFFFFFFFF),
          borderRadius: BorderRadius.all(Radius.circular(5)),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 1,
              blurRadius: 0,
              offset: Offset(0, 1), // changes position of shadow
            ),
          ]),
      child: Text(
        title,
        style: TextStyle(fontSize: 16),
      ),
    );
  }
}
