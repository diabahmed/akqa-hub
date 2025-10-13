'use client';

import { MeshGradient } from '@paper-design/shaders-react';

import { Avatar } from '../ui/avatar';

export default function LoaderShader() {
  return (
    <Avatar className="size-4">
      <MeshGradient
        width={30}
        height={30}
        colors={['#000000a8', '#ffffff', '#268187', '#d44e4e', '#33cc99', '#3399cc']}
        distortion={0.8}
        swirl={0.29}
        grainMixer={0.15}
        grainOverlay={0}
        speed={2}
        rotation={40}
      />
    </Avatar>
  );
}
