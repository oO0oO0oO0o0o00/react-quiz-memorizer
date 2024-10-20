import { Button, Center, Container, rem, Space, Title } from "@mantine/core";
import { useState } from "react";
import { resetSession } from "../src/client/mgmt";

export default function Page({  }) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState('');

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
            </Container>
        </Center>
        <Container>{state}</Container>
    </Container>
  }