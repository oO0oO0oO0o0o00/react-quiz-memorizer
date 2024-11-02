# Generated from ./MarkupParser.g4 by ANTLR 4.13.2
from antlr4 import *
if "." in __name__:
    from .MarkupParser import MarkupParser
else:
    from MarkupParser import MarkupParser

# This class defines a complete listener for a parse tree produced by MarkupParser.
class MarkupParserListener(ParseTreeListener):

    # Enter a parse tree produced by MarkupParser#lines.
    def enterLines(self, ctx:MarkupParser.LinesContext):
        pass

    # Exit a parse tree produced by MarkupParser#lines.
    def exitLines(self, ctx:MarkupParser.LinesContext):
        pass


    # Enter a parse tree produced by MarkupParser#line.
    def enterLine(self, ctx:MarkupParser.LineContext):
        pass

    # Exit a parse tree produced by MarkupParser#line.
    def exitLine(self, ctx:MarkupParser.LineContext):
        pass


    # Enter a parse tree produced by MarkupParser#template.
    def enterTemplate(self, ctx:MarkupParser.TemplateContext):
        pass

    # Exit a parse tree produced by MarkupParser#template.
    def exitTemplate(self, ctx:MarkupParser.TemplateContext):
        pass


    # Enter a parse tree produced by MarkupParser#sep.
    def enterSep(self, ctx:MarkupParser.SepContext):
        pass

    # Exit a parse tree produced by MarkupParser#sep.
    def exitSep(self, ctx:MarkupParser.SepContext):
        pass


    # Enter a parse tree produced by MarkupParser#placeholder.
    def enterPlaceholder(self, ctx:MarkupParser.PlaceholderContext):
        pass

    # Exit a parse tree produced by MarkupParser#placeholder.
    def exitPlaceholder(self, ctx:MarkupParser.PlaceholderContext):
        pass


    # Enter a parse tree produced by MarkupParser#ctrl_seq.
    def enterCtrl_seq(self, ctx:MarkupParser.Ctrl_seqContext):
        pass

    # Exit a parse tree produced by MarkupParser#ctrl_seq.
    def exitCtrl_seq(self, ctx:MarkupParser.Ctrl_seqContext):
        pass


    # Enter a parse tree produced by MarkupParser#text.
    def enterText(self, ctx:MarkupParser.TextContext):
        pass

    # Exit a parse tree produced by MarkupParser#text.
    def exitText(self, ctx:MarkupParser.TextContext):
        pass



del MarkupParser