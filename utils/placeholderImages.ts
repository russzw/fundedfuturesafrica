const EDUCATION_IMAGES = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559135689-c3706f789c06?w=800&h=400&fit=crop',
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getEducationImage(id: string): string {
  const index = hashCode(id) % EDUCATION_IMAGES.length;
  return EDUCATION_IMAGES[index];
}

export function getScholarshipImage(imageUrl: string | undefined, id: string): string {
  return imageUrl || getEducationImage(id);
}
