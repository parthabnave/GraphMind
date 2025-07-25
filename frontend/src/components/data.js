const data = {
    cells: [
        {
            type: 'basic.Rect', // Ensure this is a valid JointJS type
            position: { x: 100, y: 50 },
            size: { width: 100, height: 40 },
            attrs: {
                rect: { fill: 'blue' }, // Attributes for the rectangle
                text: { text: 'Box 1', fill: 'white' } // Attributes for the text
            }
        },
        {
            type: 'basic.Text', // Example of adding a text element
            position: { x: 100, y: 100 },
            attrs: {
                text: { text: 'Hello World', fill: 'black' }
            }
        }
    ]
};

export default data;