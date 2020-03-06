import { FunctionalComponent, h } from 'preact';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const BurnDown: FunctionalComponent = () => {
    const data = [
        {
            date: new Date(2020, 1, 20),
            value: 10,
        },
        {
            date: new Date(2020, 1, 21),
            value: 9,
        },
        {
            date: new Date(2020, 1, 22),
            value: 7,
        },
        {
            date: new Date(2020, 1, 23),
            value: 4,
        },
        {
            date: new Date(2020, 1, 24),
            value: 3,
        },
        {
            date: new Date(2020, 1, 25),
            value: 0,
        },
    ];

    return (
        <LineChart width={1200} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis dataKey="value" />
            <Tooltip />
        </LineChart>
    );
};

export default BurnDown;
