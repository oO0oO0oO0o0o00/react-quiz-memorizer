import { Button, Center, Container, rem, Space, Title } from "@mantine/core";
import { useState } from "react";
import { resetSession } from "../src/client/mgmt";
import { textMatches } from "../src/model/text-matchers";

export default function Page({  }) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState('');
    const [matchTestResult, setMatchTestResult] = useState(false);

    async function handleResetSession() {
        setLoading(true);
        setState('');
        const res = await resetSession();
        setState(res);
        setLoading(false);
    }

    return <Container size="md" style={{
        paddingTop: rem(100)
    }}>
        <Center>
            <Container>
                <Title>Meow~</Title>
                <Space h="md" />
                <Button onClick={handleResetSession} loading={loading}>Reset Session</Button>
                <Space h="md" />
                <Button onClick={() => setMatchTestResult(textMatches({
                    answers: [[1, 0, 2], [0, 2, 1], [0, 'x', 'x']],
                    entries: ["我是", "一只猫", "喵~"]
                } as any, "我是一只猫喵~"))}>Test Text Matcher</Button>
                <Space h="md" />
                <div>Matches: {matchTestResult ? 'Y' : 'N'}</div>
            </Container>
        </Center>
        <Container>{state}</Container>
    </Container>
  }