
    CREATE TABLE IF NOT EXISTS categories (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      "desc" VARCHAR(255),
      parent_id INTEGER,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  

    CREATE TABLE IF NOT EXISTS brands (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      "desc" TEXT,
      short_desc TEXT,
      img_url VARCHAR(255),
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  

    CREATE TABLE IF NOT EXISTS products (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      short_desc TEXT,
      "desc" TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
      img_url VARCHAR(255),
      img_url2 VARCHAR(255),
      img_url3 VARCHAR(255),
      img_url4 VARCHAR(255),
      img_url5 VARCHAR(255),
      img_url6 VARCHAR(255),
      balance INTEGER,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  

    CREATE TABLE IF NOT EXISTS sections (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      class_list VARCHAR(255),
      content1 TEXT,
      content1_class_list VARCHAR(255),
      content2 TEXT,
      content2_class_list VARCHAR(255),
      content3 TEXT,
      content3_class_list VARCHAR(255),
      content4 TEXT,
      content4_class_list VARCHAR(255),
      plain_content1 VARCHAR(255),
      plain_content2 VARCHAR(255),
      plain_content3 VARCHAR(255),
      plain_content4 VARCHAR(255),
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  

    CREATE TABLE IF NOT EXISTS slides (
      id BIGINT PRIMARY KEY,
      "order" INTEGER DEFAULT 0,
      mobile_img_url VARCHAR(255),
      img_url VARCHAR(255),
      remarks VARCHAR(255),
      is_show BOOLEAN DEFAULT false,
      content TEXT,
      is_banner BOOLEAN DEFAULT false,
      class_list VARCHAR(255) DEFAULT 'col-lg-4 col-sm-6 col-12',
      youtube_url VARCHAR(255),
      is_djtech BOOLEAN DEFAULT false,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  

    CREATE TABLE IF NOT EXISTS pages (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      subtitle VARCHAR(255),
      content TEXT,
      img_url VARCHAR(255),
      route_name VARCHAR(255),
      file_name VARCHAR(255),
      sorting_index INTEGER DEFAULT 0,
      show_nav BOOLEAN DEFAULT true,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS storefront_design_revisions (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      css text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS storefront_design_publication (
      singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
      revision_id integer REFERENCES storefront_design_revisions(id)
    );

    CREATE TABLE IF NOT EXISTS homepage_revisions (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      html text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS homepage_publication (
      singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
      revision_id integer REFERENCES homepage_revisions(id)
    );
