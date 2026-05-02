import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlan } from "@/hooks/usePlan";
import { useAuthStore } from "@/stores/authStore";
import type { PlanId } from "@/types/plans";

// Mock authStore
vi.mock("@/stores/authStore");

const mockUsePlan = (planId: PlanId) => {
  vi.mocked(useAuthStore).mockImplementation((selector: any) =>
    selector({
      user: { email: "test@gmail.com", firstName: "Test", planId },
      token: "mock-token",
      setAuth: vi.fn(),
      logout: vi.fn(),
      isLoggedIn: () => true,
    }),
  );
};

describe("usePlan", () => {
  describe("FREE plan", () => {
    beforeEach(() => mockUsePlan("FREE"));

    it("isFree = true", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isFree).toBe(true);
    });

    it("isPlus = false", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isPlus).toBe(false);
    });

    it("isPremium = false", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isPremium).toBe(false);
    });

    it('canUse("categories") = false', () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.canUse("categories")).toBe(false);
    });

    it('canUse("household_tracker") = false', () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.canUse("household_tracker")).toBe(false);
    });
  });

  describe("PLUS plan", () => {
    beforeEach(() => mockUsePlan("PLUS"));

    it("isFree = false", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isFree).toBe(false);
    });

    it("isPlus = true", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isPlus).toBe(true);
    });

    it('canUse("categories") = true', () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.canUse("categories")).toBe(true);
    });

    it('canUse("household_tracker") = false — cần Premium', () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.canUse("household_tracker")).toBe(false);
    });
  });

  describe("PREMIUM plan", () => {
    beforeEach(() => mockUsePlan("PREMIUM"));

    it("isPremium = true", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isPremium).toBe(true);
    });

    it("isPlus = true — Premium bao gồm Plus", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.isPlus).toBe(true);
    });

    it("canUse tất cả tính năng", () => {
      const { result } = renderHook(() => usePlan());
      expect(result.current.canUse("categories")).toBe(true);
      expect(result.current.canUse("household_tracker")).toBe(true);
      expect(result.current.canUse("ai_assistant")).toBe(true);
    });
  });
});
