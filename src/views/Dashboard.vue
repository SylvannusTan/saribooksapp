<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">My Books</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title>Add New Book</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addBook">
              <v-text-field
                v-model="newBook.title"
                label="Title"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="newBook.author"
                label="Author"
                required
              ></v-text-field>
              
              <v-textarea
                v-model="newBook.description"
                label="Description"
                rows="3"
              ></v-textarea>
              
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                block
              >
                Add Book
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="8">
        <v-alert
          v-if="errorMsg"
          type="error"
          dismissible
          class="mb-4"
        >
          {{ errorMsg }}
        </v-alert>
        
        <v-card v-if="loading && !books.length" class="d-flex justify-center align-center" height="200">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-card>
        
        <v-alert
          v-else-if="!books.length"
          type="info"
          class="mb-4"
        >
          You haven't added any books yet. Add your first book!
        </v-alert>
        
        <v-row v-else>
          <v-col v-for="book in books" :key="book.id" cols="12" sm="6" lg="4">
            <v-card class="h-100">
              <v-card-title class="text-h6">{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.author }}</v-card-subtitle>
              <v-card-text>
                <p>{{ book.description }}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="error"
                  text
                  @click="deleteBook(book.id)"
                  :loading="deletingId === book.id"
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const books = ref([])
const loading = ref(true)
const errorMsg = ref('')
const deletingId = ref(null)
const newBook = ref({
  title: '',
  author: '',
  description: ''
})

onMounted(async () => {
  await fetchBooks()
})

const fetchBooks = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    books.value = data || []
  } catch (error) {
    errorMsg.value = error.message || 'Failed to fetch books'
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

const addBook = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    if (!newBook.value.title || !newBook.value.author) {
      throw new Error('Title and author are required')
    }
    
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: newBook.value.title,
          author: newBook.value.author,
          description: newBook.value.description,
          user_id: user.id
        }
      ])
      .select()
    
    if (error) throw error
    
    books.value = [data[0], ...books.value]
    
    // Reset form
    newBook.value = {
      title: '',
      author: '',
      description: ''
    }
  } catch (error) {
    errorMsg.value = error.message || 'Failed to add book'
    console.error('Error adding book:', error)
  } finally {
    loading.value = false
  }
}

const deleteBook = async (id) => {
  try {
    deletingId.value = id
    errorMsg.value = ''
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    books.value = books.value.filter(book => book.id !== id)
  } catch (error) {
    errorMsg.value = error.message || 'Failed to delete book'
    console.error('Error deleting book:', error)
  } finally {
    deletingId.value = null
  }
}
</script>
