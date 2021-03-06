class Board {
  final String name;
  final List<Section> sections;

  Board({required this.name, required this.sections});

  factory Board.fromJson(Map<String, dynamic> json) {
    final name = json['name'] as String?;
    final sectionsArray = json['sections'] as List?;

    if (name == null || sectionsArray == null) {
      throw ArgumentError('Missing data');
    }

    final sections = sectionsArray.map((e) => Section.fromJson(e)).toList();

    return Board(name: name, sections: sections);
  }
}

class Section {
  final String id;
  final String name;
  final String? textColor;
  final String? backgroundColor;
  final List<Card> cards;

  Section(
      {required this.id,
      required this.name,
      this.textColor,
      this.backgroundColor,
      required this.cards});

  factory Section.fromJson(Map<String, dynamic> json) {
    final id = json['id'] as String?;
    final name = json['name'] as String?;
    final textColor = json['textColor'] as String?;
    final backgroundColor = json['backgroundColor'] as String?;
    final cardsArray = json['cards'] as List?;

    if (id == null || name == null || cardsArray == null) {
      throw ArgumentError('Missing data');
    }

    final cards = cardsArray.map((e) => Card.fromJson(e)).toList();

    return Section(
        id: id,
        name: name,
        textColor: textColor,
        backgroundColor: backgroundColor,
        cards: cards);
  }
}

class Card {
  final String id;
  final String name;
  final String content;

  Card({required this.id, required this.name, required this.content});

  factory Card.fromJson(Map<String, dynamic> json) {
    final id = json['id'] as String?;
    final name = json['name'] as String?;
    final content = json['content'] as String?;

    if (id == null || name == null || content == null) {
      throw ArgumentError('Missing data');
    }

    return Card(id: id, name: name, content: content);
  }
}
