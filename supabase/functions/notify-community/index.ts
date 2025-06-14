
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { contentId, authorName, type, title } = await req.json()

    console.log('Processing notification for content:', { contentId, authorName, type, title })

    // Récupérer tous les utilisateurs (sauf l'auteur)
    const { data: users, error: usersError } = await supabaseClient.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    // Récupérer l'auteur du contenu pour l'exclure
    const { data: content, error: contentError } = await supabaseClient
      .from('community_content')
      .select('user_id')
      .eq('id', contentId)
      .single()

    if (contentError) {
      console.error('Error fetching content:', contentError)
      throw contentError
    }

    const authorId = content.user_id

    // Filtrer les utilisateurs (exclure l'auteur)
    const targetUsers = users.users.filter(user => user.id !== authorId)

    console.log(`Sending notifications to ${targetUsers.length} users`)

    // Créer les notifications en base
    const notifications = targetUsers.map(user => ({
      content_id: contentId,
      user_id: user.id,
      type: 'new_content',
      title: `📢 Nouveau ${type === 'prayer' ? 'demande de prière' : type === 'note' ? 'réflexion' : type === 'verse' ? 'verset' : 'témoignage'}`,
      message: `${authorName} a publié "${title}". Découvrez ce nouveau contenu dans la communauté !`,
      is_read: false,
      email_sent: false
    }))

    const { error: notificationError } = await supabaseClient
      .from('community_notifications')
      .insert(notifications)

    if (notificationError) {
      console.error('Error creating notifications:', notificationError)
      throw notificationError
    }

    // Envoyer des emails (optionnel pour l'instant)
    // Pour implémenter l'envoi d'emails, vous pourriez utiliser un service comme Resend
    // const emailResults = await Promise.allSettled(
    //   targetUsers.map(user => sendEmail(user.email, title, authorName, type))
    // )

    console.log(`Successfully created ${notifications.length} notifications`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: notifications.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in notify-community function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
