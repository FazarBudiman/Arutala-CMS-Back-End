import { describe, it, expect, afterAll } from "vitest";
import { pool } from "@api/db/pool";
import { AuthService } from "../service";


describe("AuthService Refresh Token (DB)", () => {
  const refreshToken = "test-refresh-token";

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

  it("should delete refresh token", async () => {
    await AuthService.deleteRefreshToken({ refreshToken });

    const { rows } = await pool.query(
      "SELECT * FROM authentications WHERE refresh_token = $1",
      [refreshToken]
    );

    expect(rows.length).toBe(0);
  });
});
