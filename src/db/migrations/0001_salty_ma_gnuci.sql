CREATE TABLE "blog_embeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"contentful_id" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"locale" varchar(10) DEFAULT 'en-US' NOT NULL,
	"title" text NOT NULL,
	"short_description" text,
	"author_name" varchar(255),
	"published_date" timestamp,
	"chunk_content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"total_chunks" integer NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"tags" text[],
	"last_synced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "blog_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "slug_idx" ON "blog_embeddings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "contentful_id_idx" ON "blog_embeddings" USING btree ("contentful_id");--> statement-breakpoint
CREATE INDEX "locale_idx" ON "blog_embeddings" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "chunk_idx" ON "blog_embeddings" USING btree ("contentful_id","chunk_index");--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);