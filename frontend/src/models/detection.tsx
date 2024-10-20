interface Detection {
  bbox: [number, number, number, number];
  class: string;
  confidence: number;
}

export default Detection;
