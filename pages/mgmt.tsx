import { Button, Center, Container, rem, Space, Title } from "@mantine/core";

export default function Page({  }) {
    return <Container size="md" style={{
        paddingTop: rem(100)
    }}>
        <Center>
            <Container>
                <Title>Meow~</Title>
                <Space h="md" />
                <Button>Regenerate Example Session</Button>
            </Container>
        </Center>
    </Container>
  }