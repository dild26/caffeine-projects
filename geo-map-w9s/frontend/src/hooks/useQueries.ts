import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Pin, Polygon, ManifestLogEntry, Coordinate, OperationType, StripeConfiguration, ShoppingItem, ImageAdjustment, SitemapEntry, PageAuditEntry, ControlledRoute, ECEFCoordinate, WebMercatorCoordinate } from '../backend';

// Temporary GridCell type until backend is updated
export type GridCell = {
  id: string;
  coordinates: Coordinate;
  ecef: ECEFCoordinate;
  webMercator: WebMercatorCoordinate;
  gridNumber: bigint;
  x: number;
  y: number;
  z: number;
};

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      queryClient.invalidateQueries({ queryKey: ['pageAuditLog'] });
    },
  });
}

export function useRemovePage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['sitemap'] });
      queryClient.invalidateQueries({ queryKey: ['pageAuditLog'] });
    },
  });
}

export function useGetSitemap() {
  const { actor, isFetching } = useActor();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemap'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSitemap();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPageAuditLog() {
  const { actor, isFetching } = useActor();

  return useQuery<PageAuditEntry[]>({
    queryKey: ['pageAuditLog'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPageAuditLog();
      } catch (err) {
        console.error('Failed to fetch audit log:', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetControlledRoutes() {
  const { actor, isFetching } = useActor();

  return useQuery<ControlledRoute[]>({
    queryKey: ['controlledRoutes'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getControlledRoutes();
      } catch (err) {
        console.error('Failed to fetch controlled routes:', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePin() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pin: Omit<Pin, 'userId' | 'timestamp'>) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const fullPin: Pin = {
        ...pin,
        userId: identity.getPrincipal(),
        timestamp: BigInt(Date.now() * 1000000),
      };
      return actor.createPin(fullPin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pins'] });
    },
  });
}

export function useGetUserPins() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Pin[]>({
    queryKey: ['pins', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserPins(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useCreatePolygon() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (polygon: Omit<Polygon, 'userId' | 'timestamp'>) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const fullPolygon: Polygon = {
        ...polygon,
        userId: identity.getPrincipal(),
        timestamp: BigInt(Date.now() * 1000000),
      };
      return actor.createPolygon(fullPolygon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polygons'] });
    },
  });
}

export function useGetUserPolygons() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Polygon[]>({
    queryKey: ['polygons', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserPolygons(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetManifestLog() {
  const { actor, isFetching } = useActor();

  return useQuery<ManifestLogEntry[]>({
    queryKey: ['manifestLog'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getManifestLog();
      } catch (err) {
        console.error('Failed to fetch manifest log:', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return JSON.parse(result);
    },
  });
}

export function useCreateImageAdjustment() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adjustment: Omit<ImageAdjustment, 'userId' | 'timestamp'>) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const fullAdjustment: ImageAdjustment = {
        ...adjustment,
        userId: identity.getPrincipal(),
        timestamp: BigInt(Date.now() * 1000000),
      };
      return actor.createImageAdjustment(fullAdjustment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageAdjustments'] });
    },
  });
}

export function useGetUserImageAdjustments() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ImageAdjustment[]>({
    queryKey: ['imageAdjustments', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserImageAdjustments(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useSaveImageAdjustmentPermanently() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adjustmentId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveImageAdjustmentPermanently(adjustmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageAdjustments'] });
    },
  });
}

// Helper function to calculate grid cell from coordinates
async function calculateGridCell(actor: any, latitude: number, longitude: number, altitude: number): Promise<GridCell> {
  const ecef = await actor.convertToECEF(latitude, longitude, altitude);
  const webMercator = await actor.convertToWebMercator(latitude, longitude);
  
  return {
    id: `cell-${Math.floor(latitude)}-${Math.floor(longitude)}`,
    coordinates: { latitude, longitude, altitude },
    ecef,
    webMercator,
    gridNumber: BigInt(Math.floor(latitude) * 360 + Math.floor(longitude)),
    x: ecef.x,
    y: ecef.y,
    z: ecef.z,
  };
}

export function useGetTooltipData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ longitude, latitude }: { longitude: number; latitude: number }) => {
      if (!actor) throw new Error('Actor not available');
      const gridCell = await calculateGridCell(actor, latitude, longitude, 0);
      return {
        coordinates: { latitude, longitude, altitude: 0 },
        gridCell,
      };
    },
  });
}

// Aliases for backward compatibility
export const usePlacePin = useCreatePin;
export const useGetAllPins = useGetUserPins;
export const useGetAllPolygons = useGetUserPolygons;
export const useGetAllImageAdjustments = useGetUserImageAdjustments;
export const useSaveImageAdjustment = useCreateImageAdjustment;
