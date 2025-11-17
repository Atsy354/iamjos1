                                                                                                    "use server";

                                                                                                    import { revalidatePath } from "next/cache";
                                                                                                    import { z } from "zod";

                                                                                                    import { getSupabaseAdminClient } from "@/lib/supabase/admin";

                                                                                                    const journalSchema = z.object({
                                                                                                      title: z.string().trim().min(3, "Judul minimal 3 karakter."),
                                                                                                      path: z
                                                                                                        .string()
                                                                                                        .trim()
                                                                                                        .toLowerCase()
                                                                                                        .min(1, "Path wajib diisi.")
                                                                                                        .regex(/^[a-z0-9\-]+$/, "Path hanya boleh huruf, angka, dan tanda minus."),
                                                                                                      description: z
                                                                                                        .string()
                                                                                                        .trim()
                                                                                                        .transform((value) => (value.length > 0 ? value : null))
                                                                                                        .nullable(),
                                                                                                      isPublic: z.boolean(),
                                                                                                    });

                                                                                                    type Result =
                                                                                                      | { success: true }
                                                                                                      | { success: false; message: string };

                                                                                                    const revalidateHostedJournals = () =>
                                                                                                      revalidatePath("/admin/site-management/hosted-journals");

                                                                                                    export async function createJournalAction(input: {
                                                                                                      title: string;
                                                                                                      path: string;
                                                                                                      description?: string | null;
                                                                                                      isPublic: boolean;
                                                                                                    }): Promise<Result> {
                                                                                                      const parsed = journalSchema.safeParse(input);
                                                                                                      if (!parsed.success) {
                                                                                                        return {
                                                                                                          success: false,
                                                                                                          message: parsed.error.issues[0]?.message ?? "Validasi gagal.",
                                                                                                        };
                                                                                                      }

                                                                                                      const supabase = getSupabaseAdminClient();
                                                                                                      const { error } = await supabase
                                                                                                        .from("journals")
                                                                                                        .insert({
                                                                                                          title: parsed.data.title,
                                                                                                          path: parsed.data.path,
                                                                                                          description: parsed.data.description,
                                                                                                          is_public: parsed.data.isPublic,
                                                                                                        });

                                                                                                      if (error) {
                                                                                                        if (error.code === "23505") {
                                                                                                          return {
                                                                                                            success: false,
                                                                                                            message: "Path jurnal sudah digunakan. Gunakan path lain.",
                                                                                                          };
                                                                                                        }

                                                                                                        return {
                                                                                                          success: false,
                                                                                                          message: "Tidak dapat membuat jurnal baru.",
                                                                                                        };
                                                                                                      }

                                                                                                      revalidateHostedJournals();
                                                                                                      return { success: true };
                                                                                                    }

                                                                                                    export async function updateJournalAction(input: {
                                                                                                      id: string;
                                                                                                      title: string;
                                                                                                      path: string;
                                                                                                      description?: string | null;
                                                                                                      isPublic: boolean;
                                                                                                    }): Promise<Result> {
                                                                                                      const parsed = journalSchema.safeParse(input);
                                                                                                      if (!parsed.success) {
                                                                                                        return {
                                                                                                          success: false,
                                                                                                          message: parsed.error.issues[0]?.message ?? "Validasi gagal.",
                                                                                                        };
                                                                                                      }

                                                                                                      const supabase = getSupabaseAdminClient();
                                                                                                      const { error } = await supabase
                                                                                                        .from("journals")
                                                                                                        .update({
                                                                                                          title: parsed.data.title,
                                                                                                          path: parsed.data.path,
                                                                                                          description: parsed.data.description,
                                                                                                          is_public: parsed.data.isPublic,
                                                                                                        })
                                                                                                        .eq("id", input.id);

                                                                                                      if (error) {
                                                                                                        if (error.code === "23505") {
                                                                                                          return {
                                                                                                            success: false,
                                                                                                            message: "Path jurnal sudah digunakan. Gunakan path lain.",
                                                                                                          };
                                                                                                        }

                                                                                                        return {
                                                                                                          success: false,
                                                                                                          message: "Tidak dapat memperbarui jurnal.",
                                                                                                        };
                                                                                                      }

                                                                                                      revalidateHostedJournals();
                                                                                                      return { success: true };
                                                                                                    }

                                                                                                    export async function deleteJournalAction(id: string): Promise<Result> {
                                                                                                      const supabase = getSupabaseAdminClient();
                                                                                                      const { error } = await supabase.from("journals").delete().eq("id", id);

                                                                                                      if (error) {
                                                                                                        return {
                                                                                                          success: false,
                                                                                                          message: "Tidak dapat menghapus jurnal ini.",
                                                                                                        };
                                                                                                      }

                                                                                                      revalidateHostedJournals();
                                                                                                      return { success: true };
                                                                                                    }


