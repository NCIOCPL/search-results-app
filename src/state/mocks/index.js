// Mock js objects for intial dev purposes.

const tumor = {
  searchParams: "swKeyword=tumor&page=1&pageunit=10&Offset=0",
  search: {
    results: [
      {
        title: 'Desmoid Tumor - National Cancer Institute',
        url:
          'https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-soft-tissue-tumors/desmoid-tumor',
        contentType: 'cgvArticle',
        description:
          'Desmoid tumors grow from the connective tissue in your body. Desmoid tumors are benign, which means they are not cancer, but they are very difficult to get rid of and can be painful to live with. Learn more about diagnosis, treatments, and prognosis for desmoid tumors.',
      },
      {
        title: 'Rare Tumors - National Cancer Institute',
        url: 'https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors',
        contentType: 'cgvMiniLanding',
        description:
          'Rare tumors can form anywhere in the body. My Pediatric and Adult Rare Tumor Network (MyPART) is studying tumors in several different body systems.',
      },
      {
        title: 'Tumor Markers - National Cancer Institute',
        url:
          'https://www.cancer.gov/about-cancer/diagnosis-staging/diagnosis/tumor-markers-fact-sheet',
        contentType: 'cgvArticle',
        description:
          'A fact sheet that defines tumor markers and describes how they can be used to aid diagnosis and treatment.',
      },
      {
        title: 'Brain Tumors—Patient Version - National Cancer Institute',
        url: 'https://www.cancer.gov/types/brain',
        contentType: 'cgvCancerTypeHome',
        description:
          'Brain tumors are growths of malignant cells in tissues of the brain. Tumors that start in the brain are called primary brain tumors. Tumors that spread to the brain are called metastatic brain tumors. Start here to find information on brain cancer treatment, research, and statistics.',
      },
      {
        title:
          'Brain Tumors—Health Professional Version - National Cancer Institute',
        url: 'https://www.cancer.gov/types/brain/hp',
        contentType: 'cgvCancerTypeHome',
        description:
          'Brain and spinal cord tumors include anaplastic astrocytomas and glioblastomas, meningiomas, pituitary tumors, schwannomas, ependymomas, and sarcomas. Find evidence-based information on brain tumor treatment, research, genetics, and statistics.',
      },
      {
        title: 'Pituitary Tumors—Patient Version - National Cancer Institute',
        url: 'https://www.cancer.gov/types/pituitary',
        contentType: 'cgvCancerTypeHome',
        description:
          'Pituitary tumors are usually not cancer and are called pituitary adenomas. They grow slowly and do not spread. Rarely, pituitary tumors are cancer and they can spread to distant parts of the body. Start here to find information on pituitary tumors treatment.',
      },
      {
        title:
          'Pituitary Tumors—Health Professional Version - National Cancer Institute',
        url: 'https://www.cancer.gov/types/pituitary/hp',
        contentType: 'cgvCancerTypeHome',
        description:
          'Pituitary tumors represent from 10% to 25% of all intracranial neoplasms. Pituitary tumors can be classified into three groups: benign adenoma, invasive adenoma, and carcinoma. Find evidence-based information on pituitary tumors treatment.',
      },
      {
        title:
          'Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ®)–Patient Version - National Cancer Institute',
        url: 'https://www.cancer.gov/types/kidney/patient/wilms-treatment-pdq',
        contentType: 'pdqCancerInfoSummary',
        description:
          'Wilms tumor and other childhood kidney tumors treatment usually includes surgery and may be followed by radiation therapy or chemotherapy. Other treatments may include immunotherapy or high-dose chemotherapy with stem cell rescue. Learn more in this expert-reviewed summary.',
      },
      {
        title:
          'Pineal Region Tumor Survivor Lives Fully with Inoperable Tumor - National Cancer Institute',
        url:
          'https://www.cancer.gov/rare-brain-spine-tumor/blog/2019/pineal-survivor',
        contentType: 'cgvBlogPost',
        description:
          'A pineal region tumor survivor shares how he found the best care, treatments and resources to live.',
      },
      {
        title:
          'Pancreatic Neuroendocrine Tumors (Islet Cell Tumors) Treatment (PDQ®)–Patient Version - National Cancer Institute',
        url:
          'https://www.cancer.gov/types/pancreatic/patient/pnet-treatment-pdq',
        contentType: 'pdqCancerInfoSummary',
        description:
          'Pancreatic neuroendocrine tumors (islet cell tumors) treatments include surgery, hormone therapy, chemotherapy, targeted therapy, and supportive care. Learn more about the treatment of newly diagnosed and recurrent pancreatic neuroendocrine tumors in this expert-reviewed summary.',
      },
    ],
    totalResults: 8699,
  },
  bestBets: [
      {
      id: '23423',
      name: 'R01 - Category Name',
      weight: 11,
      results: [
        {
          title: 'Grant Mechanisms and Descriptions',
          link: 'http://deainfo.nci.nih.gov/flash/awards.htm',
          description:
            'List of grant mechanisms, with descriptions and links to associated program announcements.',
        },
        {
          title: 'Research Project Grants',
          link: 'http://deais.nci.nih.gov/foastatus/RFA-PA.jsp?mech=R01,R21',
          description:
            'Find current and recent NCI and Trans-NIH Research Project Grants (R01 and R21) that provide funding for specific areas of cancer research.',
        },
      ],
    },
  ],
  dictionary: {
    // This is the original shape of the response. We should remove the extraneous details and only retain the
    // term details.
    // meta: {
    //   offset: 0,
    //   result_count: 1,
    //   audience: 'Patient',
    //   language: 'English',
    //   message: ['Found 1 results.'],
    // },
    // result: [
      // {
        // id: 46634,
        // matched: 'tumor',
        // term: {
          id: '46634',
          term: 'tumor',
          alias: [],
          date_last_modified: '2009-03-20',
          definition: {
            html:
              'An abnormal\r mass of tissue that results when cells divide more than\r they should or do not die when they should.\r Tumors may be benign (not\r cancer), or malignant (cancer). Also called neoplasm.',
            text:
              'An abnormal\r mass of tissue that results when cells divide more than\r they should or do not die when they should.\r Tumors may be benign (not\r cancer), or malignant (cancer). Also called neoplasm.',
          },
          videos: [],
          pronunciation: {
            audio: '/PublishedContent/Media/CDR/media/709838.mp3',
            key: '(TOO-mer)',
          },
          related: {
            drug_summary: [],
            external: [],
            summary: [],
            term: [],
          },
        // },
      // },
  //   ],
  },
};

// Exporting as such so that complex (non-keyable) strings can be used
export default {
  tumor: tumor,
};
