import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import { User } from './models/User'
import { Teacher } from './models/Teacher'
import { Subject } from './models/Subject'
import { Curriculum } from './models/Curriculum'

dotenv.config()

// Comprehensive Nigerian School Curriculum Subjects
const NIGERIAN_SUBJECTS = [
  // PRE-NURSERY SUBJECTS
  { name: 'Numeracy', code: 'NUM-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Basic number recognition and counting' },
  { name: 'Early Literacy', code: 'LIT-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to letters and phonics' },
  { name: 'Personal Development', code: 'PD-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Social and emotional development' },
  { name: 'Creative Arts', code: 'ART-PN', level: 'Pre-Nursery', creditUnits: 1, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Drawing, painting and crafts' },
  { name: 'Physical Development', code: 'PHY-PN', level: 'Pre-Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Motor skills and physical activities' },

  // NURSERY SUBJECTS
  { name: 'Numeracy', code: 'NUM-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Number operations and basic arithmetic' },
  { name: 'Literacy', code: 'LIT-NS', level: 'Nursery', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Reading, writing and comprehension' },
  { name: 'Phonics', code: 'PHO-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sound recognition and blending' },
  { name: 'Environmental Studies', code: 'ENV-NS', level: 'Nursery', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to nature and environment' },
  { name: 'Creative Arts', code: 'ART-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Art, music and creative expression' },
  { name: 'Physical Education', code: 'PE-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports and physical activities' },
  { name: 'Social Studies', code: 'SS-NS', level: 'Nursery', creditUnits: 1, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Community and family awareness' },

  // PRIMARY SCHOOL SUBJECTS (Classes 1-6)
  { name: 'English Language', code: 'ENG-PR', level: 'Primary', creditUnits: 4, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Comprehensive English language skills' },
  { name: 'Mathematics', code: 'MTH-PR', level: 'Primary', creditUnits: 4, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Numeracy and mathematical concepts' },
  { name: 'Basic Science', code: 'BSC-PR', level: 'Primary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Introduction to science concepts' },
  { name: 'Social Studies', code: 'SS-PR', level: 'Primary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Civic education and social sciences' },
  { name: 'Creative Arts', code: 'ART-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Visual arts and music' },
  { name: 'Physical Education', code: 'PE-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports and health education' },
  { name: 'Computer Studies', code: 'CST-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'ICT basics and computer literacy' },
  { name: 'Islamic Religion Studies', code: 'IRS-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Islamic education and ethics' },
  { name: 'Christian Religion Studies', code: 'CRS-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Christian education and ethics' },
  { name: 'Yoruba Language', code: 'YOR-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Yoruba language and culture' },
  { name: 'Igbo Language', code: 'IGB-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Igbo language and culture' },
  { name: 'Hausa Language', code: 'HSA-PR', level: 'Primary', creditUnits: 2, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Hausa language and culture' },

  // SECONDARY SCHOOL SUBJECTS (JSS 1-3 and SSS 1-3)
  // Core Subjects
  { name: 'English Language', code: 'ENG-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Advanced English language and literature' },
  { name: 'Mathematics', code: 'MTH-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Advanced mathematics' },
  { name: 'Integrated Science', code: 'ISC-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Biology, Chemistry, Physics (JSS)' },
  { name: 'Social Studies', code: 'SS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Civic education, history, geography' },

  // Science Subjects (SSS)
  { name: 'Physics', code: 'PHY-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Physics curriculum' },
  { name: 'Chemistry', code: 'CHM-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Chemistry curriculum' },
  { name: 'Biology', code: 'BIO-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Biology curriculum' },
  { name: 'Further Mathematics', code: 'FMT-SEC', level: 'Secondary', creditUnits: 5, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Advanced mathematics (SSS 2-3)' },

  // Arts/Humanities Subjects
  { name: 'Literature in English', code: 'LEN-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Literature curriculum' },
  { name: 'History', code: 'HIS-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'World and African history' },
  { name: 'Geography', code: 'GEO-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Physical and human geography' },
  { name: 'Government', code: 'GOV-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Political science and government' },
  { name: 'Economics', code: 'ECO-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Economics principles and applications' },

  // Vocational/Technical Subjects
  { name: 'Computer Science', code: 'CSC-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO Computer Science' },
  { name: 'Information Technology', code: 'IT-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'VOCATIONAL', curriculumType: 'NIGERIAN', description: 'Practical ICT skills' },
  { name: 'Business Studies', code: 'BUS-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Commerce and business concepts' },
  { name: 'Accounting', code: 'ACC-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Bookkeeping and accounting principles' },
  { name: 'Technical Drawing', code: 'TD-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'VOCATIONAL', curriculumType: 'NIGERIAN', description: 'Engineering and technical drawing' },

  // Language Subjects
  { name: 'French', code: 'FRN-SEC', level: 'Secondary', creditUnits: 4, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'WAEC/NECO French' },
  { name: 'Yoruba', code: 'YOR-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Yoruba language and culture' },
  { name: 'Igbo', code: 'IGB-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Igbo language and culture' },
  { name: 'Hausa', code: 'HSA-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Hausa language and culture' },
  { name: 'Arabic', code: 'ARB-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Arabic language and culture' },

  // Special Subjects
  { name: 'Physical Education', code: 'PE-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Sports science and health education' },
  { name: 'Health Education', code: 'HED-SEC', level: 'Secondary', creditUnits: 2, subjectCategory: 'CORE', curriculumType: 'NIGERIAN', description: 'Health and wellness education' },
  { name: 'Islamic Religion Studies', code: 'IRS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Islamic education (WAEC/NECO)' },
  { name: 'Christian Religion Studies', code: 'CRS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Christian education (WAEC/NECO)' },
  { name: 'Fine Arts', code: 'FA-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Visual arts and design' },
  { name: 'Music', code: 'MUS-SEC', level: 'Secondary', creditUnits: 3, subjectCategory: 'ELECTIVE', curriculumType: 'NIGERIAN', description: 'Music theory and practice' },
]

const DEFAULT_ADMIN = {
  email: 'admin@folusho.com',
  name: 'Admin User',
  password: 'AdminPassword123!@#',
  role: 'Admin',
}

// Comprehensive topic generator for Nigerian School Curriculum
function generateTopicsForSubject(subject: any) {
  const allTopics: Record<string, Record<string, any[]>> = {
    // PRE-NURSERY SUBJECTS
    'Numeracy': {
      'Pre-Nursery': [
        { weekNumber: 1, topicName: 'Numbers 1-5', objectives: ['Count from 1 to 5', 'Recognize number symbols'], duration: 3, resources: ['Number cards 1-5', 'Counting objects'], assessmentMethod: 'Observation' },
        { weekNumber: 2, topicName: 'Numbers 6-10', objectives: ['Count from 6 to 10', 'Match numbers to objects'], duration: 3, resources: ['Number cards 6-10', 'Counting frame'], assessmentMethod: 'Observation' },
        { weekNumber: 3, topicName: 'Shapes - Circle and Square', objectives: ['Identify circles', 'Identify squares'], duration: 3, resources: ['Shape cutouts', 'Shape templates'], assessmentMethod: 'Sorting activity' },
        { weekNumber: 4, topicName: 'Shapes - Triangle and Rectangle', objectives: ['Identify triangles', 'Identify rectangles'], duration: 3, resources: ['Shape models', 'Drawing materials'], assessmentMethod: 'Drawing activity' },
        { weekNumber: 5, topicName: 'Big and Small', objectives: ['Classify objects by size', 'Use comparison words'], duration: 3, resources: ['Objects of different sizes', 'Picture cards'], assessmentMethod: 'Sorting' },
        { weekNumber: 6, topicName: 'Long and Short', objectives: ['Compare lengths', 'Use length words'], duration: 3, resources: ['String, ribbons', 'Measuring tools'], assessmentMethod: 'Comparison activity' },
        { weekNumber: 7, topicName: 'Colors', objectives: ['Identify primary colors', 'Sort by color'], duration: 3, resources: ['Color cards', 'Colored objects'], assessmentMethod: 'Sorting game' },
        { weekNumber: 8, topicName: 'Patterns - Simple', objectives: ['Recognize simple patterns', 'Complete patterns'], duration: 3, resources: ['Pattern blocks', 'Colored beads'], assessmentMethod: 'Pattern completion' },
        { weekNumber: 9, topicName: 'One-to-One Correspondence', objectives: ['Match one-to-one', 'Count accurately'], duration: 3, resources: ['Objects, containers'], assessmentMethod: 'Matching activity' },
        { weekNumber: 10, topicName: 'More and Less', objectives: ['Compare quantities', 'Use more/less words'], duration: 3, resources: ['Objects, picture cards'], assessmentMethod: 'Comparison exercise' },
        { weekNumber: 11, topicName: 'Addition Basics (1+1, 2+1)', objectives: ['Add two small numbers', 'Understand combining'], duration: 3, resources: ['Counting objects', 'Number cards'], assessmentMethod: 'Object-based addition' },
        { weekNumber: 12, topicName: 'Subtraction Basics (2-1)', objectives: ['Remove objects', 'Understand taking away'], duration: 3, resources: ['Counting objects', 'Removal activities'], assessmentMethod: 'Object-based subtraction' },
        { weekNumber: 13, topicName: 'Revision and Assessment', objectives: ['Review all topics', 'Demonstrate understanding'], duration: 3, resources: ['Review materials', 'Assessment cards'], assessmentMethod: 'Overall assessment' },
      ],
    },
    'Early Literacy': {
      'Pre-Nursery': [
        { weekNumber: 1, topicName: 'Letter Recognition A-E', objectives: ['Recognize letters A-E', 'Trace letters'], duration: 3, resources: ['Letter cards', 'Tracing paper'], assessmentMethod: 'Recognition activity' },
        { weekNumber: 2, topicName: 'Letter Recognition F-J', objectives: ['Recognize letters F-J', 'Trace letters'], duration: 3, resources: ['Letter cards', 'Tracing books'], assessmentMethod: 'Identification' },
        { weekNumber: 3, topicName: 'Letter Recognition K-O', objectives: ['Recognize letters K-O', 'Match letters'], duration: 3, resources: ['Letter flash cards', 'Matching games'], assessmentMethod: 'Matching activity' },
        { weekNumber: 4, topicName: 'Letter Recognition P-T', objectives: ['Recognize letters P-T', 'Find letters'], duration: 3, resources: ['Letter hunt materials', 'Picture books'], assessmentMethod: 'Letter hunt' },
        { weekNumber: 5, topicName: 'Letter Recognition U-Z', objectives: ['Recognize letters U-Z', 'Complete alphabet'], duration: 3, resources: ['Alphabet chart', 'Letter blocks'], assessmentMethod: 'Alphabet completion' },
        { weekNumber: 6, topicName: 'Sound /a/ - Apple', objectives: ['Hear /a/ sound', 'Find /a/ words'], duration: 3, resources: ['Sound cards', 'Picture cards'], assessmentMethod: 'Sound identification' },
        { weekNumber: 7, topicName: 'Sound /e/ - Egg', objectives: ['Hear /e/ sound', 'Match /e/ pictures'], duration: 3, resources: ['Sound cards', 'Real objects'], assessmentMethod: 'Matching by sound' },
        { weekNumber: 8, topicName: 'Sound /i/ - Ice', objectives: ['Hear /i/ sound', 'Repeat /i/ words'], duration: 3, resources: ['Sound cards', 'Picture book'], assessmentMethod: 'Repetition exercise' },
        { weekNumber: 9, topicName: 'Sound /o/ - Orange', objectives: ['Hear /o/ sound', 'Respond to /o/ words'], duration: 3, resources: ['Real objects', 'Song materials'], assessmentMethod: 'Response activity' },
        { weekNumber: 10, topicName: 'Sound /u/ - Umbrella', objectives: ['Hear /u/ sound', 'Find /u/ words'], duration: 3, resources: ['Sound cards', 'Picture hunt'], assessmentMethod: 'Word finding' },
        { weekNumber: 11, topicName: 'Simple Words - Cat, Dog, Mat', objectives: ['Recognize simple words', 'Point to words'], duration: 3, resources: ['Word cards', 'Picture books'], assessmentMethod: 'Word recognition' },
        { weekNumber: 12, topicName: 'Rhyming Words', objectives: ['Hear rhymes', 'Match rhyming words'], duration: 3, resources: ['Rhyme cards', 'Songs'], assessmentMethod: 'Rhyming game' },
        { weekNumber: 13, topicName: 'Revision and Book Exploration', objectives: ['Review sounds and letters', 'Enjoy books'], duration: 3, resources: ['Review cards', 'Picture books'], assessmentMethod: 'Story time' },
      ],
    },

    // PRIMARY SCHOOL TOPICS
    'English Language': {
      'Primary': [
        { weekNumber: 1, topicName: 'Parts of Speech - Nouns', objectives: ['Identify nouns', 'Use nouns in sentences'], duration: 5, resources: ['Grammar textbook', 'Word cards', 'Picture cards'], assessmentMethod: 'Identification exercise' },
        { weekNumber: 2, topicName: 'Parts of Speech - Verbs', objectives: ['Identify action verbs', 'Use verbs correctly'], duration: 5, resources: ['Action cards', 'Video clips'], assessmentMethod: 'Action identification' },
        { weekNumber: 3, topicName: 'Parts of Speech - Adjectives', objectives: ['Identify adjectives', 'Describe objects'], duration: 5, resources: ['Picture cards', 'Word list'], assessmentMethod: 'Description exercise' },
        { weekNumber: 4, topicName: 'Sentence Structure - Subjects and Predicates', objectives: ['Identify subject and predicate', 'Create sentences'], duration: 5, resources: ['Textbook', 'Sentence cards'], assessmentMethod: 'Sentence building' },
        { weekNumber: 5, topicName: 'Comprehension - Main Idea', objectives: ['Identify main idea', 'Answer questions'], duration: 5, resources: ['Reading passage', 'Question sheet'], assessmentMethod: 'Comprehension questions' },
        { weekNumber: 6, topicName: 'Comprehension - Details', objectives: ['Find supporting details', 'Answer detail questions'], duration: 5, resources: ['Text excerpt', 'Question cards'], assessmentMethod: 'Detail identification' },
        { weekNumber: 7, topicName: 'Punctuation - Period and Question Mark', objectives: ['Use periods correctly', 'Use question marks'], duration: 5, resources: ['Sentence cards', 'Workbook'], assessmentMethod: 'Punctuation exercise' },
        { weekNumber: 8, topicName: 'Capitalization - Days, Months, Names', objectives: ['Capitalize properly', 'Use capital letters'], duration: 5, resources: ['Calendar', 'Name cards'], assessmentMethod: 'Writing exercise' },
        { weekNumber: 9, topicName: 'Reading - Phonetic Decoding', objectives: ['Decode words', 'Read fluently'], duration: 5, resources: ['Phonetic readers', 'Word lists'], assessmentMethod: 'Reading assessment' },
        { weekNumber: 10, topicName: 'Writing - Simple Sentences', objectives: ['Write complete sentences', 'Use proper grammar'], duration: 5, resources: ['Writing paper', 'Model sentences'], assessmentMethod: 'Writing assignment' },
        { weekNumber: 11, topicName: 'Vocabulary - Synonyms and Antonyms', objectives: ['Identify synonyms', 'Find antonyms'], duration: 5, resources: ['Word cards', 'Thesaurus'], assessmentMethod: 'Word matching' },
        { weekNumber: 12, topicName: 'Literature - Fairy Tales', objectives: ['Analyze fairy tales', 'Discuss themes'], duration: 5, resources: ['Fairy tale books', 'Discussion guide'], assessmentMethod: 'Story discussion' },
        { weekNumber: 13, topicName: 'Revision and Assessment', objectives: ['Review all topics', 'Demonstrate competency'], duration: 5, resources: ['Review sheets', 'Test paper'], assessmentMethod: 'Final assessment' },
      ],
    },
    'Mathematics': {
      'Primary': [
        { weekNumber: 1, topicName: 'Place Value - Units and Tens', objectives: ['Understand place value', 'Write numbers'], duration: 5, resources: ['Base-10 blocks', 'Place value chart'], assessmentMethod: 'Place value identification' },
        { weekNumber: 2, topicName: 'Place Value - Hundreds', objectives: ['Understand hundreds', 'Compare numbers'], duration: 5, resources: ['Abacus', 'Number cards'], assessmentMethod: 'Comparison exercise' },
        { weekNumber: 3, topicName: 'Addition - Single Digit', objectives: ['Add single digits', 'Memorize facts'], duration: 5, resources: ['Addition flash cards', 'Manipulatives'], assessmentMethod: 'Speed drill' },
        { weekNumber: 4, topicName: 'Addition - Two Digits', objectives: ['Add two-digit numbers', 'Regroup'], duration: 5, resources: ['Worksheet', 'Base-10 blocks'], assessmentMethod: 'Problem solving' },
        { weekNumber: 5, topicName: 'Subtraction - Single Digit', objectives: ['Subtract single digits', 'Memorize facts'], duration: 5, resources: ['Flash cards', 'Number line'], assessmentMethod: 'Fact fluency' },
        { weekNumber: 6, topicName: 'Subtraction - Two Digits', objectives: ['Subtract two-digit numbers', 'Regroup'], duration: 5, resources: ['Worksheet', 'Manipulatives'], assessmentMethod: 'Algorithm practice' },
        { weekNumber: 7, topicName: 'Multiplication - Concept', objectives: ['Understand multiplication', 'Use arrays'], duration: 5, resources: ['Arrays model', 'Picture cards'], assessmentMethod: 'Concept demonstration' },
        { weekNumber: 8, topicName: 'Multiplication - Tables 2-5', objectives: ['Memorize times tables', 'Apply multiplication'], duration: 5, resources: ['Times table chart', 'Flash cards'], assessmentMethod: 'Multiplication drill' },
        { weekNumber: 9, topicName: 'Division - Concept', objectives: ['Understand division', 'Divide equally'], duration: 5, resources: ['Manipulatives', 'Picture cards'], assessmentMethod: 'Sharing activity' },
        { weekNumber: 10, topicName: 'Fractions - Halves and Quarters', objectives: ['Divide into parts', 'Name fractions'], duration: 5, resources: ['Fraction circles', 'Paper folding'], assessmentMethod: 'Identification exercise' },
        { weekNumber: 11, topicName: 'Measurement - Length and Weight', objectives: ['Measure length', 'Compare weights'], duration: 5, resources: ['Rulers', 'Scales'], assessmentMethod: 'Measurement activity' },
        { weekNumber: 12, topicName: 'Geometry - Shapes and Properties', objectives: ['Identify shapes', 'Describe properties'], duration: 5, resources: ['Shape models', 'Tangrams'], assessmentMethod: 'Shape classification' },
        { weekNumber: 13, topicName: 'Problem Solving and Assessment', objectives: ['Solve word problems', 'Review all skills'], duration: 5, resources: ['Word problem cards', 'Test paper'], assessmentMethod: 'Comprehensive test' },
      ],
    },

    // SECONDARY SCHOOL TOPICS  
    'English Language': {
      'Secondary': [
        { weekNumber: 1, topicName: 'Literature in Context - Nigerian Writers', objectives: ['Study Nigerian authors', 'Understand cultural context'], duration: 5, resources: ['Literature anthology', 'Author biography'], assessmentMethod: 'Essay' },
        { weekNumber: 2, topicName: 'Poetry - Themes and Devices', objectives: ['Analyze poetic devices', 'Identify themes'], duration: 5, resources: ['Poetry collection', 'Analysis guide'], assessmentMethod: 'Poetry analysis' },
        { weekNumber: 3, topicName: 'Drama - Shakespeare and Modern', objectives: ['Study dramatic works', 'Analyze characters'], duration: 5, resources: ['Play texts', 'Video clips'], assessmentMethod: 'Character analysis' },
        { weekNumber: 4, topicName: 'Prose - Novel Structure', objectives: ['Analyze plot structure', 'Discuss themes'], duration: 5, resources: ['Novel', 'Study guide'], assessmentMethod: 'Novel discussion' },
        { weekNumber: 5, topicName: 'Grammar - Complex Sentences', objectives: ['Write complex sentences', 'Use punctuation'], duration: 5, resources: ['Grammar textbook', 'Writing samples'], assessmentMethod: 'Writing exercise' },
        { weekNumber: 6, topicName: 'Grammar - Tenses and Aspects', objectives: ['Master verb tenses', 'Use correctly'], duration: 5, resources: ['Tense chart', 'Worksheets'], assessmentMethod: 'Tense practice' },
        { weekNumber: 7, topicName: 'Comprehension - Critical Reading', objectives: ['Read critically', 'Analyze arguments'], duration: 5, resources: ['Texts, articles'], assessmentMethod: 'Comprehension test' },
        { weekNumber: 8, topicName: 'Writing - Essays and Reports', objectives: ['Write formal essays', 'Create reports'], duration: 5, resources: ['Writing guide', 'Model essays'], assessmentMethod: 'Essay writing' },
        { weekNumber: 9, topicName: 'Vocabulary - Academic Terms', objectives: ['Learn academic vocabulary', 'Use appropriately'], duration: 5, resources: ['Vocabulary list', 'Context cards'], assessmentMethod: 'Vocabulary test' },
        { weekNumber: 10, topicName: 'Oral Communication - Public Speaking', objectives: ['Deliver speeches', 'Communicate effectively'], duration: 5, resources: ['Speech topics', 'Recording device'], assessmentMethod: 'Speech delivery' },
        { weekNumber: 11, topicName: 'Listening and Note-Taking', objectives: ['Listen actively', 'Take notes'], duration: 5, resources: ['Audio materials', 'Note templates'], assessmentMethod: 'Note-taking exercise' },
        { weekNumber: 12, topicName: 'WAEC Exam Preparation', objectives: ['Review exam format', 'Practice questions'], duration: 5, resources: ['Past papers', 'Sample questions'], assessmentMethod: 'Mock exam' },
        { weekNumber: 13, topicName: 'Final Assessment and Review', objectives: ['Demonstrate mastery', 'Review all topics'], duration: 5, resources: ['Review guide', 'Assessment tool'], assessmentMethod: 'Final exam' },
      ],
    },
    'Mathematics': {
      'Secondary': [
        { weekNumber: 1, topicName: 'Number Systems - Real Numbers', objectives: ['Classify number types', 'Understand properties'], duration: 5, resources: ['Textbook', 'Number line'], assessmentMethod: 'Classification exercise' },
        { weekNumber: 2, topicName: 'Algebra - Linear Equations', objectives: ['Solve linear equations', 'Graph lines'], duration: 5, resources: ['Graphing tools', 'Equation cards'], assessmentMethod: 'Problem solving' },
        { weekNumber: 3, topicName: 'Algebra - Quadratic Equations', objectives: ['Solve quadratic equations', 'Factor polynomials'], duration: 5, resources: ['Textbook', 'Factoring guide'], assessmentMethod: 'Algebraic solution' },
        { weekNumber: 4, topicName: 'Functions and Relations', objectives: ['Understand functions', 'Analyze relations'], duration: 5, resources: ['Function notation', 'Graphing calculator'], assessmentMethod: 'Function analysis' },
        { weekNumber: 5, topicName: 'Geometry - Angles and Triangles', objectives: ['Calculate angles', 'Prove theorems'], duration: 5, resources: ['Geometry tools', 'Theorem cards'], assessmentMethod: 'Geometric proof' },
        { weekNumber: 6, topicName: 'Geometry - Circles and Area', objectives: ['Calculate arc length', 'Find area'], duration: 5, resources: ['Circle templates', 'Formula sheet'], assessmentMethod: 'Calculation practice' },
        { weekNumber: 7, topicName: 'Trigonometry - Ratios', objectives: ['Calculate trig ratios', 'Solve triangles'], duration: 5, resources: ['Trig table', 'Calculator'], assessmentMethod: 'Calculation test' },
        { weekNumber: 8, topicName: 'Trigonometry - Applications', objectives: ['Apply trigonometry', 'Solve problems'], duration: 5, resources: ['Problem cards', 'Real-world examples'], assessmentMethod: 'Problem solving' },
        { weekNumber: 9, topicName: 'Statistics - Data Analysis', objectives: ['Analyze data', 'Create graphs'], duration: 5, resources: ['Data sets', 'Graphing software'], assessmentMethod: 'Data project' },
        { weekNumber: 10, topicName: 'Statistics - Probability', objectives: ['Calculate probability', 'Analyze distributions'], duration: 5, resources: ['Dice, cards', 'Probability guide'], assessmentMethod: 'Probability test' },
        { weekNumber: 11, topicName: 'Calculus Basics - Limits and Derivatives', objectives: ['Understand limits', 'Calculate derivatives'], duration: 5, resources: ['Calculus text', 'Formula sheet'], assessmentMethod: 'Calculus problems' },
        { weekNumber: 12, topicName: 'WAEC Exam Preparation - Review All Topics', objectives: ['Review all mathematics', 'Practice exam questions'], duration: 5, resources: ['Past papers', 'Review materials'], assessmentMethod: 'Mock exam' },
        { weekNumber: 13, topicName: 'Final Assessment and Problem Solving', objectives: ['Solve complex problems', 'Demonstrate mastery'], duration: 5, resources: ['Assessment paper'], assessmentMethod: 'Comprehensive exam' },
      ],
    },
    'Biology': {
      'Secondary': [
        { weekNumber: 1, topicName: 'Cell Biology - Cell Structure', objectives: ['Identify cell organelles', 'Understand functions'], duration: 5, resources: ['Microscope', 'Cell models'], assessmentMethod: 'Labeling exercise' },
        { weekNumber: 2, topicName: 'Cell Biology - Cell Division', objectives: ['Understand mitosis', 'Study meiosis'], duration: 5, resources: ['Cell division diagrams', 'Animation'], assessmentMethod: 'Diagram labeling' },
        { weekNumber: 3, topicName: 'Genetics - Inheritance', objectives: ['Understand Mendelian laws', 'Solve genetics problems'], duration: 5, resources: ['Punnett squares', 'Genetics problems'], assessmentMethod: 'Genetics problems' },
        { weekNumber: 4, topicName: 'Genetics - DNA and Protein Synthesis', objectives: ['Understand DNA structure', 'Study protein making'], duration: 5, resources: ['DNA model', 'Diagram cards'], assessmentMethod: 'Concept explanation' },
        { weekNumber: 5, topicName: 'Ecology - Ecosystems', objectives: ['Understand food chains', 'Study interactions'], duration: 5, resources: ['Ecosystem diagrams', 'Video'], assessmentMethod: 'Ecosystem mapping' },
        { weekNumber: 6, topicName: 'Ecology - Population Dynamics', objectives: ['Analyze populations', 'Understand growth'], duration: 5, resources: ['Population data', 'Graphs'], assessmentMethod: 'Data analysis' },
        { weekNumber: 7, topicName: 'Photosynthesis', objectives: ['Understand light reactions', 'Study Calvin cycle'], duration: 5, resources: ['Process diagram', 'Equation cards'], assessmentMethod: 'Process explanation' },
        { weekNumber: 8, topicName: 'Respiration', objectives: ['Understand cellular respiration', 'Compare aerobic/anaerobic'], duration: 5, resources: ['Respiration diagram', 'Equations'], assessmentMethod: 'Energy calculation' },
        { weekNumber: 9, topicName: 'Human Body - Circulatory System', objectives: ['Understand heart', 'Study blood vessels'], duration: 5, resources: ['Heart model', 'Blood flow diagram'], assessmentMethod: 'Labeling and questions' },
        { weekNumber: 10, topicName: 'Human Body - Respiratory System', objectives: ['Understand lungs', 'Study gas exchange'], duration: 5, resources: ['Lung model', 'Respiratory tract diagram'], assessmentMethod: 'Breathing experiment' },
        { weekNumber: 11, topicName: 'Evolution and Natural Selection', objectives: ['Understand evolution', 'Study adaptations'], duration: 5, resources: ['Evolution timeline', 'Case studies'], assessmentMethod: 'Essay on evolution' },
        { weekNumber: 12, topicName: 'WAEC Exam Preparation', objectives: ['Review all biology topics', 'Practice questions'], duration: 5, resources: ['Past papers', 'Sample questions'], assessmentMethod: 'Mock exam' },
        { weekNumber: 13, topicName: 'Final Practical and Assessment', objectives: ['Conduct lab practicals', 'Final exam'], duration: 5, resources: ['Lab equipment', 'Practical guide'], assessmentMethod: 'Practical exam' },
      ],
    },
    'Physics': {
      'Secondary': [
        { weekNumber: 1, topicName: 'Mechanics - Motion', objectives: ['Understand velocity', 'Calculate acceleration'], duration: 5, resources: ['Equations of motion', 'Motion simulator'], assessmentMethod: 'Calculation problems' },
        { weekNumber: 2, topicName: 'Mechanics - Forces', objectives: ['Understand Newton\'s laws', 'Solve force problems'], duration: 5, resources: ['Force diagrams', 'Free body diagrams'], assessmentMethod: 'Force calculation' },
        { weekNumber: 3, topicName: 'Mechanics - Work and Energy', objectives: ['Calculate work', 'Understand energy'], duration: 5, resources: ['Energy equations', 'Work problems'], assessmentMethod: 'Energy problems' },
        { weekNumber: 4, topicName: 'Mechanics - Power and Efficiency', objectives: ['Calculate power', 'Find efficiency'], duration: 5, resources: ['Power formula', 'Problem cards'], assessmentMethod: 'Power calculations' },
        { weekNumber: 5, topicName: 'Waves - Properties', objectives: ['Understand wave characteristics', 'Measure wavelength'], duration: 5, resources: ['Wave simulator', 'Wave equations'], assessmentMethod: 'Wave analysis' },
        { weekNumber: 6, topicName: 'Sound', objectives: ['Understand sound properties', 'Study acoustics'], duration: 5, resources: ['Sound recorder', 'Frequency equipment'], assessmentMethod: 'Sound experiment' },
        { weekNumber: 7, topicName: 'Light - Reflection and Refraction', objectives: ['Study light behavior', 'Solve optics problems'], duration: 5, resources: ['Mirrors, lenses', 'Ray diagram'], assessmentMethod: 'Optics experiment' },
        { weekNumber: 8, topicName: 'Electricity - Current and Voltage', objectives: ['Understand circuits', 'Measure current'], duration: 5, resources: ['Circuit kit', 'Multimeter'], assessmentMethod: 'Circuit lab' },
        { weekNumber: 9, topicName: 'Electricity - Resistance and Power', objectives: ['Calculate resistance', 'Find power'], duration: 5, resources: ['Resistor values', 'Formula sheet'], assessmentMethod: 'Electrical calculations' },
        { weekNumber: 10, topicName: 'Magnetism', objectives: ['Understand magnetic fields', 'Study electromagnetic induction'], duration: 5, resources: ['Magnets', 'Iron filings'], assessmentMethod: 'Magnetism experiment' },
        { weekNumber: 11, topicName: 'Modern Physics - Atoms and Nuclei', objectives: ['Understand atomic structure', 'Study radioactivity'], duration: 5, resources: ['Atomic models', 'Decay equations'], assessmentMethod: 'Nuclear problems' },
        { weekNumber: 12, topicName: 'WAEC Exam Preparation', objectives: ['Review all physics', 'Practice problems'], duration: 5, resources: ['Past papers', 'Problem bank'], assessmentMethod: 'Mock exam' },
        { weekNumber: 13, topicName: 'Final Practical and Exam', objectives: ['Complete practicals', 'Final assessment'], duration: 5, resources: ['Lab equipment', 'Experiment guides'], assessmentMethod: 'Practical exam' },
      ],
    },
    'Chemistry': {
      'Secondary': [
        { weekNumber: 1, topicName: 'Atomic Structure and Periodic Table', objectives: ['Understand atoms', 'Locate elements'], duration: 5, resources: ['Periodic table', 'Atom models'], assessmentMethod: 'Periodic table quiz' },
        { weekNumber: 2, topicName: 'Chemical Bonding - Ionic', objectives: ['Understand ionic bonds', 'Write formulas'], duration: 5, resources: ['Bonding diagrams', 'Lewis structures'], assessmentMethod: 'Formula writing' },
        { weekNumber: 3, topicName: 'Chemical Bonding - Covalent', objectives: ['Understand covalent bonds', 'Draw structures'], duration: 5, resources: ['Bonding models', 'Dot diagrams'], assessmentMethod: 'Structure drawing' },
        { weekNumber: 4, topicName: 'Chemical Equations and Balancing', objectives: ['Balance equations', 'Classify reactions'], duration: 5, resources: ['Equation cards', 'Balancing worksheet'], assessmentMethod: 'Equation balancing test' },
        { weekNumber: 5, topicName: 'Stoichiometry', objectives: ['Calculate mole ratios', 'Solve stoichiometry problems'], duration: 5, resources: ['Molar mass table', 'Problem cards'], assessmentMethod: 'Stoichiometry calculations' },
        { weekNumber: 6, topicName: 'Acids, Bases and Salts', objectives: ['Understand pH', 'Study neutralization'], duration: 5, resources: ['pH meter', 'Solutions'], assessmentMethod: 'pH lab' },
        { weekNumber: 7, topicName: 'Oxidation and Reduction', objectives: ['Identify redox reactions', 'Balance redox equations'], duration: 5, resources: ['Redox worksheet', 'Oxidation state table'], assessmentMethod: 'Redox problems' },
        { weekNumber: 8, topicName: 'Organic Chemistry - Hydrocarbons', objectives: ['Study carbon compounds', 'Name alkanes'], duration: 5, resources: ['Molecular models', 'Naming guide'], assessmentMethod: 'Nomenclature test' },
        { weekNumber: 9, topicName: 'Organic Chemistry - Functional Groups', objectives: ['Identify functional groups', 'Study reactions'], duration: 5, resources: ['Structure cards', 'Reaction chart'], assessmentMethod: 'Functional group identification' },
        { weekNumber: 10, topicName: 'States of Matter', objectives: ['Understand phase changes', 'Study properties'], duration: 5, resources: ['Phase diagram', 'State models'], assessmentMethod: 'Phase change lab' },
        { weekNumber: 11, topicName: 'Solution Chemistry', objectives: ['Understand dissolution', 'Calculate molarity'], duration: 5, resources: ['Solution worksheet', 'Concentration calculator'], assessmentMethod: 'Solution calculations' },
        { weekNumber: 12, topicName: 'WAEC Exam Preparation', objectives: ['Review all chemistry', 'Practice questions'], duration: 5, resources: ['Past papers', 'Review guide'], assessmentMethod: 'Mock exam' },
        { weekNumber: 13, topicName: 'Final Practical and Assessment', objectives: ['Complete lab practicals', 'Final exam'], duration: 5, resources: ['Chemical supplies', 'Safety equipment'], assessmentMethod: 'Practical exam' },
      ],
    },
  }

  // Try to find subject-specific topics by code pattern
  for (const topicSubject in allTopics) {
    if (subject.name.includes(topicSubject)) {
      const byLevel = allTopics[topicSubject]
      for (const level in byLevel) {
        if (subject.level === level) {
          return byLevel[level]
        }
      }
    }
  }

  // Default topics for any other subjects
  return [
    { weekNumber: 1, topicName: 'Introduction to ' + subject.name, objectives: ['Understand fundamentals', 'Learn key concepts'], duration: 5, resources: ['Textbook Chapter 1', 'Course materials'], assessmentMethod: 'Pre-assessment' },
    { weekNumber: 2, topicName: 'Core Principles', objectives: ['Master principles', 'Apply knowledge'], duration: 5, resources: ['Textbook Chapter 2', 'Case studies'], assessmentMethod: 'Quiz' },
    { weekNumber: 3, topicName: 'Advanced Concepts', objectives: ['Deepen understanding', 'Solve problems'], duration: 5, resources: ['Textbook Chapter 3', 'Worksheets'], assessmentMethod: 'Problem set' },
    { weekNumber: 4, topicName: 'Applications and Practice', objectives: ['Apply skills', 'Practice regularly'], duration: 5, resources: ['Practice materials', 'Exercises'], assessmentMethod: 'Practical work' },
    { weekNumber: 5, topicName: 'Real-World Examples', objectives: ['Connect to reality', 'See relevance'], duration: 5, resources: ['Case studies', 'Examples'], assessmentMethod: 'Analysis' },
    { weekNumber: 6, topicName: 'Problem Solving', objectives: ['Solve complex problems', 'Think critically'], duration: 5, resources: ['Problem bank', 'Thinking tools'], assessmentMethod: 'Problem solving test' },
    { weekNumber: 7, topicName: 'Review and Consolidation', objectives: ['Review concepts', 'Consolidate learning'], duration: 5, resources: ['Summary sheets', 'Review guide'], assessmentMethod: 'Review quiz' },
    { weekNumber: 8, topicName: 'Mini Project', objectives: ['Apply knowledge', 'Create something'], duration: 5, resources: ['Project brief', 'Materials'], assessmentMethod: 'Project submission' },
    { weekNumber: 9, topicName: 'Discussion and Debate', objectives: ['Share ideas', 'Think critically'], duration: 5, resources: ['Discussion topics', 'Debate materials'], assessmentMethod: 'Participation' },
    { weekNumber: 10, topicName: 'Peer Teaching', objectives: ['Explain concepts', 'Help others'], duration: 5, resources: ['Teaching materials'], assessmentMethod: 'Teaching demonstration' },
    { weekNumber: 11, topicName: 'Self-Assessment and Reflection', objectives: ['Evaluate progress', 'Identify strengths'], duration: 5, resources: ['Assessment rubric', 'Reflection sheet'], assessmentMethod: 'Self-assessment' },
    { weekNumber: 12, topicName: 'Final Review', objectives: ['Review all topics', 'Prepare for exam'], duration: 5, resources: ['Review materials', 'Study guide'], assessmentMethod: 'Review session' },
    { weekNumber: 13, topicName: 'Final Assessment', objectives: ['Demonstrate mastery', 'Show competency'], duration: 5, resources: ['Exam paper', 'Assessment tool'], assessmentMethod: 'Final exam' },
  ]
}

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB')

  await User.deleteMany({})
  await Teacher.deleteMany({})
  await Subject.deleteMany({})
  await Curriculum.deleteMany({})

  await User.create(DEFAULT_ADMIN)
  console.log('✅ Created default admin')

  // Add topics to subjects before creating them
  const subjectsWithTopics = NIGERIAN_SUBJECTS.map(subject => ({
    ...subject,
    topics: generateTopicsForSubject(subject),
  }))

  const subjects = await Subject.insertMany(subjectsWithTopics)
  console.log(`✅ Created ${subjects.length} Nigerian curriculum subjects with topics`)

  // Create default curriculum
  const primarySubjects = subjects.filter(s => s.level === 'Primary').map(s => s._id.toString())
  const secondarySubjects = subjects.filter(s => s.level === 'Secondary').map(s => s._id.toString())

  await Curriculum.create([
    {
      name: 'Nigerian Primary School Curriculum',
      version: '2023.1',
      level: 'Primary',
      yearsOfStudy: 6,
      subjects: primarySubjects,
      implementationDate: new Date('2023-09-01'),
      description: 'Current Nigerian primary school curriculum (Classes 1-6)',
      curriculum: 'NIGERIAN',
      status: 'ACTIVE',
      createdBy: 'admin@folusho.com',
    },
    {
      name: 'Nigerian Secondary School Curriculum',
      version: '2023.1',
      level: 'Secondary',
      yearsOfStudy: 6,
      subjects: secondarySubjects,
      implementationDate: new Date('2023-09-01'),
      description: 'Current Nigerian secondary school curriculum (JSS 1-3, SSS 1-3)',
      curriculum: 'NIGERIAN',
      status: 'ACTIVE',
      createdBy: 'admin@folusho.com',
    },
  ])
  console.log('✅ Created default curriculum catalogs')

  await Teacher.create({
    email: 'teacher1@folusho.com',
    name: 'Mr. Adeyemi',
    teacherId: 'T001',
    username: 'teacher1',
    password: 'TeacherPassword123!@#',
    subject: 'Mathematics',
    level: 'Secondary',
    assignedClasses: ['SSS1A', 'SSS1B', 'SSS2A'],
  })
  console.log('✅ Created default teacher')

  console.log('\n🎓 Seed completed successfully!')
  console.log(`Total Subjects: ${subjects.length}`)
  console.log('Available Levels: Pre-Nursery, Nursery, Primary, Secondary')
  process.exit(0)
}

seed().catch(console.error)