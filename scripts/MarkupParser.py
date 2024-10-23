# Generated from ./MarkupParser.g4 by ANTLR 4.13.2
# encoding: utf-8
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
	from typing import TextIO
else:
	from typing.io import TextIO

def serializedATN():
    return [
        4,1,9,60,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,
        1,0,4,0,16,8,0,11,0,12,0,17,1,1,1,1,1,1,1,1,3,1,24,8,1,1,1,3,1,27,
        8,1,1,2,1,2,1,2,4,2,32,8,2,11,2,12,2,33,1,3,1,3,1,4,1,4,5,4,40,8,
        4,10,4,12,4,43,9,4,1,4,1,4,1,4,1,5,1,5,1,5,5,5,51,8,5,10,5,12,5,
        54,9,5,1,5,1,5,1,6,1,6,1,6,0,0,7,0,2,4,6,8,10,12,0,0,60,0,15,1,0,
        0,0,2,26,1,0,0,0,4,31,1,0,0,0,6,35,1,0,0,0,8,37,1,0,0,0,10,47,1,
        0,0,0,12,57,1,0,0,0,14,16,3,2,1,0,15,14,1,0,0,0,16,17,1,0,0,0,17,
        15,1,0,0,0,17,18,1,0,0,0,18,1,1,0,0,0,19,20,3,4,2,0,20,21,5,0,0,
        1,21,27,1,0,0,0,22,24,3,4,2,0,23,22,1,0,0,0,23,24,1,0,0,0,24,25,
        1,0,0,0,25,27,5,4,0,0,26,19,1,0,0,0,26,23,1,0,0,0,27,3,1,0,0,0,28,
        32,3,8,4,0,29,32,3,12,6,0,30,32,3,6,3,0,31,28,1,0,0,0,31,29,1,0,
        0,0,31,30,1,0,0,0,32,33,1,0,0,0,33,31,1,0,0,0,33,34,1,0,0,0,34,5,
        1,0,0,0,35,36,5,3,0,0,36,7,1,0,0,0,37,41,5,1,0,0,38,40,3,10,5,0,
        39,38,1,0,0,0,40,43,1,0,0,0,41,39,1,0,0,0,41,42,1,0,0,0,42,44,1,
        0,0,0,43,41,1,0,0,0,44,45,3,4,2,0,45,46,5,2,0,0,46,9,1,0,0,0,47,
        48,5,5,0,0,48,52,5,7,0,0,49,51,5,8,0,0,50,49,1,0,0,0,51,54,1,0,0,
        0,52,50,1,0,0,0,52,53,1,0,0,0,53,55,1,0,0,0,54,52,1,0,0,0,55,56,
        5,9,0,0,56,11,1,0,0,0,57,58,5,6,0,0,58,13,1,0,0,0,7,17,23,26,31,
        33,41,52
    ]

class MarkupParser ( Parser ):

    grammarFileName = "MarkupParser.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "'['", "']'", "'/'", "'\\n'", "'=='", 
                     "<INVALID>", "<INVALID>", "<INVALID>", "' '" ]

    symbolicNames = [ "<INVALID>", "OPEN", "CLOSE", "WSEP", "NL", "CTRL_START", 
                      "TEXT", "M_CTRL_KIND", "M_CTRL_CONT", "M_CTRL_END" ]

    RULE_lines = 0
    RULE_line = 1
    RULE_template = 2
    RULE_sep = 3
    RULE_placeholder = 4
    RULE_ctrl_seq = 5
    RULE_text = 6

    ruleNames =  [ "lines", "line", "template", "sep", "placeholder", "ctrl_seq", 
                   "text" ]

    EOF = Token.EOF
    OPEN=1
    CLOSE=2
    WSEP=3
    NL=4
    CTRL_START=5
    TEXT=6
    M_CTRL_KIND=7
    M_CTRL_CONT=8
    M_CTRL_END=9

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.13.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class LinesContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def line(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(MarkupParser.LineContext)
            else:
                return self.getTypedRuleContext(MarkupParser.LineContext,i)


        def getRuleIndex(self):
            return MarkupParser.RULE_lines

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterLines" ):
                listener.enterLines(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitLines" ):
                listener.exitLines(self)




    def lines(self):

        localctx = MarkupParser.LinesContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_lines)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 15 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 14
                self.line()
                self.state = 17 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not ((((_la) & ~0x3f) == 0 and ((1 << _la) & 90) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class LineContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def template(self):
            return self.getTypedRuleContext(MarkupParser.TemplateContext,0)


        def EOF(self):
            return self.getToken(MarkupParser.EOF, 0)

        def NL(self):
            return self.getToken(MarkupParser.NL, 0)

        def getRuleIndex(self):
            return MarkupParser.RULE_line

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterLine" ):
                listener.enterLine(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitLine" ):
                listener.exitLine(self)




    def line(self):

        localctx = MarkupParser.LineContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_line)
        self._la = 0 # Token type
        try:
            self.state = 26
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,2,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 19
                self.template()
                self.state = 20
                self.match(MarkupParser.EOF)
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 23
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if (((_la) & ~0x3f) == 0 and ((1 << _la) & 74) != 0):
                    self.state = 22
                    self.template()


                self.state = 25
                self.match(MarkupParser.NL)
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TemplateContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def placeholder(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(MarkupParser.PlaceholderContext)
            else:
                return self.getTypedRuleContext(MarkupParser.PlaceholderContext,i)


        def text(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(MarkupParser.TextContext)
            else:
                return self.getTypedRuleContext(MarkupParser.TextContext,i)


        def sep(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(MarkupParser.SepContext)
            else:
                return self.getTypedRuleContext(MarkupParser.SepContext,i)


        def getRuleIndex(self):
            return MarkupParser.RULE_template

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTemplate" ):
                listener.enterTemplate(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTemplate" ):
                listener.exitTemplate(self)




    def template(self):

        localctx = MarkupParser.TemplateContext(self, self._ctx, self.state)
        self.enterRule(localctx, 4, self.RULE_template)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 31 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 31
                self._errHandler.sync(self)
                token = self._input.LA(1)
                if token in [1]:
                    self.state = 28
                    self.placeholder()
                    pass
                elif token in [6]:
                    self.state = 29
                    self.text()
                    pass
                elif token in [3]:
                    self.state = 30
                    self.sep()
                    pass
                else:
                    raise NoViableAltException(self)

                self.state = 33 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not ((((_la) & ~0x3f) == 0 and ((1 << _la) & 74) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class SepContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def WSEP(self):
            return self.getToken(MarkupParser.WSEP, 0)

        def getRuleIndex(self):
            return MarkupParser.RULE_sep

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterSep" ):
                listener.enterSep(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitSep" ):
                listener.exitSep(self)




    def sep(self):

        localctx = MarkupParser.SepContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_sep)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 35
            self.match(MarkupParser.WSEP)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PlaceholderContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def OPEN(self):
            return self.getToken(MarkupParser.OPEN, 0)

        def template(self):
            return self.getTypedRuleContext(MarkupParser.TemplateContext,0)


        def CLOSE(self):
            return self.getToken(MarkupParser.CLOSE, 0)

        def ctrl_seq(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(MarkupParser.Ctrl_seqContext)
            else:
                return self.getTypedRuleContext(MarkupParser.Ctrl_seqContext,i)


        def getRuleIndex(self):
            return MarkupParser.RULE_placeholder

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterPlaceholder" ):
                listener.enterPlaceholder(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitPlaceholder" ):
                listener.exitPlaceholder(self)




    def placeholder(self):

        localctx = MarkupParser.PlaceholderContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_placeholder)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 37
            self.match(MarkupParser.OPEN)
            self.state = 41
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while _la==5:
                self.state = 38
                self.ctrl_seq()
                self.state = 43
                self._errHandler.sync(self)
                _la = self._input.LA(1)

            self.state = 44
            self.template()
            self.state = 45
            self.match(MarkupParser.CLOSE)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class Ctrl_seqContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CTRL_START(self):
            return self.getToken(MarkupParser.CTRL_START, 0)

        def M_CTRL_KIND(self):
            return self.getToken(MarkupParser.M_CTRL_KIND, 0)

        def M_CTRL_END(self):
            return self.getToken(MarkupParser.M_CTRL_END, 0)

        def M_CTRL_CONT(self, i:int=None):
            if i is None:
                return self.getTokens(MarkupParser.M_CTRL_CONT)
            else:
                return self.getToken(MarkupParser.M_CTRL_CONT, i)

        def getRuleIndex(self):
            return MarkupParser.RULE_ctrl_seq

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterCtrl_seq" ):
                listener.enterCtrl_seq(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitCtrl_seq" ):
                listener.exitCtrl_seq(self)




    def ctrl_seq(self):

        localctx = MarkupParser.Ctrl_seqContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_ctrl_seq)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 47
            self.match(MarkupParser.CTRL_START)
            self.state = 48
            self.match(MarkupParser.M_CTRL_KIND)
            self.state = 52
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while _la==8:
                self.state = 49
                self.match(MarkupParser.M_CTRL_CONT)
                self.state = 54
                self._errHandler.sync(self)
                _la = self._input.LA(1)

            self.state = 55
            self.match(MarkupParser.M_CTRL_END)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TextContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def TEXT(self):
            return self.getToken(MarkupParser.TEXT, 0)

        def getRuleIndex(self):
            return MarkupParser.RULE_text

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterText" ):
                listener.enterText(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitText" ):
                listener.exitText(self)




    def text(self):

        localctx = MarkupParser.TextContext(self, self._ctx, self.state)
        self.enterRule(localctx, 12, self.RULE_text)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 57
            self.match(MarkupParser.TEXT)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx





