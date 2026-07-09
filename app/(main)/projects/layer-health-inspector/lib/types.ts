// Shape of /public/layer_health_inspector_dataset.json

export type Health = "healthy" | "underused" | "wasteful";

export interface Layer {
  id: string;
  name: string;
  index: number;
  type: string;
  size: number;
  shape: [number, number];
  singular_values: number[];
  true_rank: number;
  numerical_rank_threshold: number;
  numerical_rank_at_threshold: number;
  health: Health;
  effective_rank_description: string;
}

export interface PcaCloud {
  points: number[][];
  dimension: number;
  num_points: number;
  true_covariance_eigenvalues: number[];
  pca_singular_values_centered_data: number[];
  intrinsic_signal_directions: number;
}

export interface Dataset {
  layers: Layer[];
  pca_cloud: PcaCloud;
}
