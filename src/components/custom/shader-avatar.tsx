'use client';

import { MeshGradient } from '@paper-design/shaders-react';

import { Avatar } from '../ui/avatar';

export default function ShaderAvatar() {
  return (
    <Avatar className="size-4">
      <MeshGradient
        width={30}
        height={30}
        colors={['#ffffff', '#000000']}
        distortion={1}
        swirl={1}
        grainMixer={0.35}
        grainOverlay={0.15}
        speed={2}
        scale={1.2}
      />
    </Avatar>
  );
}
