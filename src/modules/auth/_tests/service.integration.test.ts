import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { pool } from "@api/db/pool";
import { AuthService } from "../service";
import { BadRequest } from "@api/utils/error";

describe("AuthService Refresh Token (DB)", () => {
  const refreshToken = "test-refresh-token";

  beforeAll(async () => {
    // pastikan clean sebelum test
    await pool.query(
      "DELETE FROM authentications WHERE refresh_token = $1",
      [refreshToken]
    );
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM authentications WHERE refresh_token = $1",
      [refreshToken]
    );
    await pool.end();
  });

  it("should save refresh token", async () => {
    await AuthService.saveRefreshToken(refreshToken);

    const { rows } = await pool.query(
      "SELECT * FROM authentications WHERE refresh_token = $1",
      [refreshToken]
    );

    expect(rows.length).toBe(1);
    expect(rows[0].refresh_token).toBe(refreshToken);
  });

  it("should confirm refresh token exists", async () => {
    await expect(
      AuthService.isRefreshTokenExist(refreshToken)
    ).resolves.toBeUndefined();
  });

  it("should delete refresh token", async () => {
    await AuthService.deleteRefreshToken({ refreshToken });

    const { rows } = await pool.query(
      "SELECT * FROM authentications WHERE refresh_token = $1",
      [refreshToken]
    );

    expect(rows.length).toBe(0);
  });

  it("should throw error when refresh token does not exist", async () => {
    await expect(
      AuthService.isRefreshTokenExist("non-existent-token")
    ).rejects.toThrow(BadRequest);
  });
});
