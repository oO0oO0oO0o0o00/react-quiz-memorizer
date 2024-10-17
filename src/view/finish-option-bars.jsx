import { Button, Grid } from "@mantine/core";

export function MistakeOptionsBar({ holder }) {
    const span = { base: 6 }
    const style = { width: "100%" }
    return <Grid>
        <Grid.Col span={span}><Button variant="outline" size="xs" radius="lg" onClick={() => holder.showAnswer()} style={style}>不会</Button></Grid.Col>
        <Grid.Col span={span}><Button size="xs" radius="lg" onClick={() => holder.reset()} style={style}>重试</Button></Grid.Col>
    </Grid>
}

export function FinishedOptionsBar({ holder }) {
    return <Button size="xs" radius="lg" onClick={() => holder.goNext()} style={{ width: "100%" }}>继续</Button>
}

export function NextPageOptionsBar({ onClick, loading }) {
    return <Button size="xs" radius="lg" onClick={onClick} style={{ width: "100%" }} loading={loading}>继续</Button>
}
