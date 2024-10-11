import { Center, Container, Title, Button, rem } from '@mantine/core';


export default function FinishPage({ scoreHolder }) {
    return <Container size="md" style={{
        paddingTop: rem(100)
    }}>
        <Center>
            <Title >完成喵~<br/><br/></Title>
        </Center>
        <Center>
            <Title >{scoreHolder.score}/{scoreHolder.total}<br/><br/></Title>
        </Center>
        <Button size="xs" radius="lg" style={{ width: "100%" }}>完成</Button>
    </Container>
}