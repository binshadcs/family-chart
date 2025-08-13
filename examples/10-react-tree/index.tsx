import React from 'react';
import { createRoot } from 'react-dom/client';
import FamilyTree from '../../src/react/FamilyTree';
import data from './data.json';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<FamilyTree data={data} width={800} height={600} />);
